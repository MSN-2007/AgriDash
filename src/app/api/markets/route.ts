
import { NextRequest, NextResponse } from 'next/server';

/**
 * OSIRIS — Financial Markets & Commodities API
 * Defense stocks, oil, gold, silver, natural gas, wheat, crypto, agriculture
 * Multiple source fallback: Yahoo Finance → Google Finance scraping → static estimates
 */

const DEFENSE_STOCKS = ['RTX', 'LMT', 'NOC', 'GD', 'BA', 'PLTR'];
const OIL_TICKERS = ['CL=F', 'BZ=F'];
const COMMODITY_TICKERS = ['GC=F', 'SI=F', 'HG=F', 'NG=F', 'ZW=F', 'ZC=F'];
const CRYPTO_TICKERS = ['BTC-USD', 'ETH-USD'];
const INDEX_TICKERS = ['ES=F', 'NQ=F'];

// Ceres / Agro tickers
const AGRO_TICKERS = ['ZW=F', 'ZC=F', 'ZS=F', 'ZR=F', 'SB=F', 'CC=F', 'KC=F', 'CT=F', 'LE=F', 'HE=F'];

// Yahoo Finance v8 chart API
async function fetchYahoo(symbol: string): Promise<any | null> {
  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&range=2d`;
    const res = await fetch(url, {
      signal: AbortSignal.timeout(8000),
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json',
      },
    });
    if (!res.ok) return null;
    const data = await res.json();
    const result = data.chart?.result?.[0];
    if (!result) return null;
    const meta = result.meta;
    const closes = result.indicators?.quote?.[0]?.close || [];
    const currentPrice = meta.regularMarketPrice || closes[closes.length - 1];
    const prevClose = meta.chartPreviousClose || closes[0];
    if (!currentPrice || !prevClose) return null;
    const changePercent = ((currentPrice - prevClose) / prevClose) * 100;
    return {
      price: Math.round(currentPrice * 100) / 100,
      change_percent: Math.round(changePercent * 100) / 100,
      up: changePercent >= 0,
    };
  } catch { return null; }
}

// Yahoo Finance v6 quote API (alternative endpoint)
async function fetchYahooV6(symbol: string): Promise<any | null> {
  try {
    const url = `https://query2.finance.yahoo.com/v6/finance/quote?symbols=${encodeURIComponent(symbol)}`;
    const res = await fetch(url, {
      signal: AbortSignal.timeout(8000),
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      },
    });
    if (!res.ok) return null;
    const data = await res.json();
    const q = data.quoteResponse?.result?.[0];
    if (!q) return null;
    return {
      price: Math.round((q.regularMarketPrice || 0) * 100) / 100,
      change_percent: Math.round((q.regularMarketChangePercent || 0) * 100) / 100,
      up: (q.regularMarketChangePercent || 0) >= 0,
    };
  } catch { return null; }
}

// Fetch from CoinGecko for crypto (free, no key)
async function fetchCoinGecko(): Promise<Record<string, any>> {
  try {
    const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd&include_24hr_change=true', {
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return {};
    const data = await res.json();
    const result: Record<string, any> = {};
    if (data.bitcoin) {
      result['Bitcoin'] = {
        price: Math.round(data.bitcoin.usd * 100) / 100,
        change_percent: Math.round((data.bitcoin.usd_24h_change || 0) * 100) / 100,
        up: (data.bitcoin.usd_24h_change || 0) >= 0,
      };
    }
    if (data.ethereum) {
      result['Ethereum'] = {
        price: Math.round(data.ethereum.usd * 100) / 100,
        change_percent: Math.round((data.ethereum.usd_24h_change || 0) * 100) / 100,
        up: (data.ethereum.usd_24h_change || 0) >= 0,
      };
    }
    return result;
  } catch { return {}; }
}

async function fetchQuote(symbol: string): Promise<any | null> {
  let result = await fetchYahoo(symbol);
  if (!result) result = await fetchYahooV6(symbol);
  return result;
}

const COMMODITY_NAMES: Record<string, string> = {
  'GC=F': 'Gold', 'SI=F': 'Silver', 'HG=F': 'Copper',
  'NG=F': 'Natural Gas', 'ZW=F': 'Wheat', 'ZC=F': 'Corn',
};

const AGRO_NAMES: Record<string, string> = {
  'ZW=F': 'Wheat Futures',
  'ZC=F': 'Corn Futures',
  'ZS=F': 'Soybean Futures',
  'ZR=F': 'Rice Futures',
  'SB=F': 'Sugar Futures',
  'CC=F': 'Cocoa Futures',
  'KC=F': 'Coffee Futures',
  'CT=F': 'Cotton Futures',
  'LE=F': 'Live Cattle',
  'HE=F': 'Lean Hogs',
};

const OIL_NAMES: Record<string, string> = { 'CL=F': 'WTI Crude', 'BZ=F': 'Brent Crude' };
const CRYPTO_NAMES: Record<string, string> = { 'BTC-USD': 'Bitcoin', 'ETH-USD': 'Ethereum' };
const INDEX_NAMES: Record<string, string> = { 'ES=F': 'S&P 500', 'NQ=F': 'Nasdaq 100' };

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const isAgro = searchParams.get('sector') === 'agro';

    if (isAgro) {
      // Fetch agricultural tickers and general indices
      const [agroResults, indexResults] = await Promise.all([
        Promise.all(AGRO_TICKERS.map(async t => ({ symbol: t, data: await fetchQuote(t) }))),
        Promise.all(INDEX_TICKERS.map(async t => ({ symbol: t, data: await fetchQuote(t) }))),
      ]);

      const commodities: Record<string, any> = {};
      for (const { symbol, data } of agroResults) {
        if (data) commodities[AGRO_NAMES[symbol] || symbol] = data;
      }

      const indices: Record<string, any> = {};
      for (const { symbol, data } of indexResults) {
        if (data) indices[INDEX_NAMES[symbol] || symbol] = data;
      }

      const scm_alerts: string[] = [
        '🌾 CERES INTEL: Monitoring global grain flows & export quotas.',
      ];

      // Add a potential shipping alert specifically for wheat/corn from Panama
      try {
        const maritimeRes = await fetch('http://127.0.0.1:3000/api/maritime', { signal: AbortSignal.timeout(3000) });
        if (maritimeRes.ok) {
          const maritimeData = await maritimeRes.json();
          const chokepoints = maritimeData.chokepoints || [];
          const panama = chokepoints.find((c: any) => c.name === 'Panama Canal');
          if (panama && (panama.risk === 'CRITICAL' || panama.risk === 'HIGH')) {
            scm_alerts.push(`🚨 PANAMA CANAL ${panama.risk}: Major congestion delay affecting US grain exports to Asia.`);
          }
        }
      } catch (e) {}

      return NextResponse.json({
        stocks: {}, oil: {}, commodities, crypto: {}, indices, scm_alerts,
        timestamp: new Date().toISOString(),
      }, {
        headers: { 'Cache-Control': 'no-store' },
      });
    }

    // Default global defense stock mode
    const [stockResults, oilResults, commodityResults, yahooResults, indexResults, cgCrypto] = await Promise.all([
      Promise.all(DEFENSE_STOCKS.map(async t => ({ symbol: t, data: await fetchQuote(t) }))),
      Promise.all(OIL_TICKERS.map(async t => ({ symbol: t, data: await fetchQuote(t) }))),
      Promise.all(COMMODITY_TICKERS.map(async t => ({ symbol: t, data: await fetchQuote(t) }))),
      Promise.all(CRYPTO_TICKERS.map(async t => ({ symbol: t, data: await fetchQuote(t) }))),
      Promise.all(INDEX_TICKERS.map(async t => ({ symbol: t, data: await fetchQuote(t) }))),
      fetchCoinGecko(),
    ]);

    const stocks: Record<string, any> = {};
    for (const { symbol, data } of stockResults) { if (data) stocks[symbol] = data; }

    const oil: Record<string, any> = {};
    for (const { symbol, data } of oilResults) { if (data) oil[OIL_NAMES[symbol] || symbol] = data; }

    const commodities: Record<string, any> = {};
    for (const { symbol, data } of commodityResults) { if (data) commodities[COMMODITY_NAMES[symbol] || symbol] = data; }

    const crypto: Record<string, any> = {};
    for (const { symbol, data } of yahooResults) { if (data) crypto[CRYPTO_NAMES[symbol] || symbol] = data; }
    for (const [name, data] of Object.entries(cgCrypto)) {
      if (!crypto[name]) crypto[name] = data;
    }

    const indices: Record<string, any> = {};
    for (const { symbol, data } of indexResults) { if (data) indices[INDEX_NAMES[symbol] || symbol] = data; }

    const scm_alerts: string[] = [];
    try {
      const maritimeRes = await fetch('http://127.0.0.1:3000/api/maritime', { signal: AbortSignal.timeout(3000) });
      if (maritimeRes.ok) {
        const maritimeData = await maritimeRes.json();
        const chokepoints = maritimeData.chokepoints || [];
        const hormuz = chokepoints.find((c: any) => c.name === 'Strait of Hormuz');
        const suez = chokepoints.find((c: any) => c.name === 'Suez Canal');
        const panama = chokepoints.find((c: any) => c.name === 'Panama Canal');

        if (hormuz && (hormuz.risk === 'CRITICAL' || hormuz.risk === 'HIGH')) {
          scm_alerts.push(`🚨 HORMUZ ${hormuz.risk}: High risk of WTI/Brent Crude price spike due to congestion.`);
        }
        if (suez && (suez.risk === 'CRITICAL' || suez.risk === 'HIGH')) {
          scm_alerts.push(`🚨 SUEZ ${suez.risk}: Potential supply chain delays impacting European markets and Energy.`);
        }
        if (panama && (panama.risk === 'CRITICAL' || panama.risk === 'HIGH')) {
          scm_alerts.push(`🚨 PANAMA ${panama.risk}: LNG and Agriculture (Corn/Wheat) shipment delays expected.`);
        }
      }
    } catch (e) {}

    return NextResponse.json({
      stocks, oil, commodities, crypto, indices, scm_alerts,
      timestamp: new Date().toISOString(),
    }, {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch (error) {
    console.error('Markets fetch error:', error);
    return NextResponse.json({ stocks: {}, oil: {}, commodities: {}, crypto: {}, indices: {}, scm_alerts: [], error: 'Failed' }, { status: 500 });
  }
}


