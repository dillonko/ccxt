'use strict';

//  ---------------------------------------------------------------------------

const Exchange = require ('./base/Exchange');
const { TICK_SIZE } = require ('./base/functions/number');
const { AuthenticationError, ExchangeError, ArgumentsRequired, PermissionDenied, InvalidOrder, OrderNotFound, DDoSProtection, NotSupported, ExchangeNotAvailable, InsufficientFunds, BadRequest, InvalidAddress, OnMaintenance, RateLimitExceeded, InvalidNonce } = require ('./base/errors');

//  ---------------------------------------------------------------------------

module.exports = class bybit extends Exchange {
    describe () {
        return this.deepExtend (super.describe (), {
            'id': 'bybit',
            'name': 'Bybit',
            'countries': [ 'VG' ], // British Virgin Islands
            'version': 'v2',
            'userAgent': undefined,
            'rateLimit': 100,
            'has': {
                'CORS': true,
                'fetchMarkets': true,
                'fetchBalance': true,
                'fetchOHLCV': true,
                // 'editOrder': true,
                // 'fetchOrder': true,
                // 'fetchOrders': false,
                // 'fetchOpenOrders': true,
                // 'fetchClosedOrders': true,
                // 'fetchMyTrades': true,
                'fetchTicker': true,
                'fetchTickers': true,
                // 'fetchOrderTrades': true,
                // 'createOrder': true,
                // 'cancelOrder': true,
                // 'cancelAllOrders': true,
                // 'withdraw': true,
                'fetchTime': true,
            },
            'timeframes': {
                '1m': '1',
                '3m': '3',
                '5m': '5',
                '15m': '15',
                '30m': '30',
                '1h': '60',
                '2h': '120',
                '3h': '180',
                '6h': '360',
                '12h': '720',
                '1d': 'D',
                '1w': 'W',
                '1M': 'M',
                '1y': 'Y',
            },
            'urls': {
                'test': 'https://api-testnet.bybit.com',
                'logo': 'https://user-images.githubusercontent.com/1294454/41933112-9e2dd65a-798b-11e8-8440-5bab2959fcb8.jpg',
                'api': 'https://api.bybit.com',
                'www': 'https://www.bybit.com/',
                'doc': [
                    'https://bybit-exchange.github.io/docs/inverse/',
                    'https://github.com/bybit-exchange',
                ],
                'fees': 'https://help.bybit.com/hc/en-us/articles/360039261154',
                'referral': 'https://www.deribit.com/reg-1189.4038',
            },
            'api': {
                'public': {
                    'get': [
                        'orderBook/L2',
                        'kline/list',
                        'tickers',
                        'trading-records',
                        'symbols',
                        'time',
                        'announcement',
                    ],
                },
                'private': {
                    'get': [
                        'order',
                        'stop-order',
                        'position/list',
                        'wallet/balance',
                        'execution/list',
                    ],
                    'post': [
                        'order/create',
                        'order/cancel',
                        'order/cancelAll',
                        'stop-order/cancelAll',
                    ],
                },
                'openapi': {
                    'get': [
                        'order/list',
                        'stop-order/list',
                        'wallet/risk-limit/list',
                        'wallet/risk-limit',
                        'funding/prev-funding-rate',
                        'funding/prev-funding',
                        'funding/predicted-funding',
                        'api-key',
                        'wallet/fund/records',
                        'wallet/withdraw/list',
                    ],
                    'post': [
                        'order/replace',
                        'stop-order/create',
                        'stop-order/cancel',
                        'stop-order/replace',
                        'position/trading-stop',
                    ],
                },
                'position': {
                    'post': [
                        'change-position-margin',
                    ],
                },
                'user': {
                    'get': [
                        'leverage',
                    ],
                    'post': [
                        'leverage/save',
                    ],
                },
            },
            'httpExceptions': {
                '403': RateLimitExceeded, // Forbidden -- You request too many times
            },
            'exceptions': {
                '10001': BadRequest, // parameter error
                '10002': InvalidNonce, // request expired, check your timestamp and recv_window
                '10003': AuthenticationError, // Invalid apikey
                '10004': AuthenticationError, // invalid sign
                '10005': PermissionDenied, // permission denied for current apikey
                '10006': RateLimitExceeded, // too many requests
                '10007': AuthenticationError, // api_key not found in your request parameters
                '10010': PermissionDenied, // request ip mismatch
                '10017': BadRequest, // request path not found or request method is invalid
                '20001': InvalidOrder, // Order not exists
                '20003': InvalidOrder, // missing parameter side
                '20004': InvalidOrder, // invalid parameter side
                '20005': InvalidOrder, // missing parameter symbol
                '20006': InvalidOrder, // invalid parameter symbol
                '20007': InvalidOrder, // missing parameter order_type
                '20008': InvalidOrder, // invalid parameter order_type
                '20009': InvalidOrder, // missing parameter qty
                '20010': InvalidOrder, // qty must be greater than 0
                '20011': InvalidOrder, // qty must be an integer
                '20012': InvalidOrder, // qty must be greater than zero and less than 1 million
                '20013': InvalidOrder, // missing parameter price
                '20014': InvalidOrder, // price must be greater than 0
                '20015': InvalidOrder, // missing parameter time_in_force
                '20016': InvalidOrder, // invalid value for parameter time_in_force
                '20017': InvalidOrder, // missing parameter order_id
                '20018': InvalidOrder, // invalid date format
                '20019': InvalidOrder, // missing parameter stop_px
                '20020': InvalidOrder, // missing parameter base_price
                '20021': InvalidOrder, // missing parameter stop_order_id
                '20022': BadRequest, // missing parameter leverage
                '20023': BadRequest, // leverage must be a number
                '20031': BadRequest, // leverage must be greater than zero
                '20070': BadRequest, // missing parameter margin
                '20071': BadRequest, // margin must be greater than zero
                '20084': BadRequest, // order_id or order_link_id is required
                '30001': BadRequest, // order_link_id is repeated
                '30003': InvalidOrder, // qty must be more than the minimum allowed
                '30004': InvalidOrder, // qty must be less than the maximum allowed
                '30005': InvalidOrder, // price exceeds maximum allowed
                '30007': InvalidOrder, // price exceeds minimum allowed
                '30008': InvalidOrder, // invalid order_type
                '30009': ExchangeError, // no position found
                '30010': InsufficientFunds, // insufficient wallet balance
                '30011': PermissionDenied, // operation not allowed as position is undergoing liquidation
                '30012': PermissionDenied, // operation not allowed as position is undergoing ADL
                '30013': PermissionDenied, // position is in liq or adl status
                '30014': InvalidOrder, // invalid closing order, qty should not greater than size
                '30015': InvalidOrder, // invalid closing order, side should be opposite
                '30016': ExchangeError, // TS and SL must be cancelled first while closing position
                '30017': InvalidOrder, // estimated fill price cannot be lower than current Buy liq_price
                '30018': InvalidOrder, // estimated fill price cannot be higher than current Sell liq_price
                '30019': InvalidOrder, // cannot attach TP/SL params for non-zero position when placing non-opening position order
                '30020': InvalidOrder, // position already has TP/SL params
                '30021': InvalidOrder, // cannot afford estimated position_margin
                '30022': InvalidOrder, // estimated buy liq_price cannot be higher than current mark_price
                '30023': InvalidOrder, // estimated sell liq_price cannot be lower than current mark_price
                '30024': InvalidOrder, // cannot set TP/SL/TS for zero-position
                '30025': InvalidOrder, // trigger price should bigger than 10% of last price
                '30026': InvalidOrder, // price too high
                '30027': InvalidOrder, // price set for Take profit should be higher than Last Traded Price
                '30028': InvalidOrder, // price set for Stop loss should be between Liquidation price and Last Traded Price
                '30029': InvalidOrder, // price set for Stop loss should be between Last Traded Price and Liquidation price
                '30030': InvalidOrder, // price set for Take profit should be lower than Last Traded Price
                '30031': InsufficientFunds, // insufficient available balance for order cost
                '30032': InvalidOrder, // order has been filled or cancelled
                '30033': RateLimitExceeded, // The number of stop orders exceeds maximum limit allowed
                '30034': OrderNotFound, // no order found
                '30035': RateLimitExceeded, // too fast to cancel
                '30036': ExchangeError, // the expected position value after order execution exceeds the current risk limit
                '30037': InvalidOrder, // order already cancelled
                '30041': ExchangeError, // no position found
                '30042': InsufficientFunds, // insufficient wallet balance
                '30043': PermissionDenied, // operation not allowed as position is undergoing liquidation
                '30044': PermissionDenied, // operation not allowed as position is undergoing AD
                '30045': PermissionDenied, // operation not allowed as position is not normal status
                '30049': InsufficientFunds, // insufficient available balance
                '30050': ExchangeError, // any adjustments made will trigger immediate liquidation
                '30051': ExchangeError, // due to risk limit, cannot adjust leverage
                '30052': ExchangeError, // leverage can not less than 1
                '30054': ExchangeError, // position margin is invalid
                '30057': ExchangeError, // requested quantity of contracts exceeds risk limit
                '30063': ExchangeError, // reduce-only rule not satisfied
                '30067': InsufficientFunds, // insufficient available balance
                '30068': ExchangeError, // exit value must be positive
                '34026': ExchangeError, // the limit is no change
            },
            'precisionMode': TICK_SIZE,
            'options': {
                'code': 'BTC',
                'fetchBalance': {
                    'code': 'BTC',
                },
                'recvWindow': 5 * 1000, // 5 sec default
                'timeDifference': 0, // the difference between system clock and Binance clock
                'adjustForTimeDifference': false, // controls the adjustment logic upon instantiation
            },
        });
    }

    nonce () {
        return this.milliseconds () - this.options['timeDifference'];
    }

    async loadTimeDifference () {
        const serverTime = await this.fetchTime ();
        const after = this.milliseconds ();
        this.options['timeDifference'] = after - serverTime;
        return this.options['timeDifference'];
    }

    async fetchTime (params = {}) {
        const response = await this.publicGetTime (params);
        //
        //     {
        //         ret_code: 0,
        //         ret_msg: 'OK',
        //         ext_code: '',
        //         ext_info: '',
        //         result: {},
        //         time_now: '1583933682.448826'
        //     }
        //
        return this.safeTimestamp (response, 'time_now');
    }

    async fetchMarkets (params = {}) {
        if (this.options['adjustForTimeDifference']) {
            await this.loadTimeDifference ();
        }
        const response = await this.publicGetSymbols (params);
        //
        //     {
        //         ret_code: 0,
        //         ret_msg: 'OK',
        //         ext_code: '',
        //         ext_info: '',
        //         result: [
        //             {
        //                 name: 'BTCUSD',
        //                 base_currency: 'BTC',
        //                 quote_currency: 'USD',
        //                 price_scale: 2,
        //                 taker_fee: '0.00075',
        //                 maker_fee: '-0.00025',
        //                 leverage_filter: { min_leverage: 1, max_leverage: 100, leverage_step: '0.01' },
        //                 price_filter: { min_price: '0.5', max_price: '999999.5', tick_size: '0.5' },
        //                 lot_size_filter: { max_trading_qty: 1000000, min_trading_qty: 1, qty_step: 1 }
        //             },
        //         ],
        //         time_now: '1583930495.454196'
        //     }
        //
        const markets = this.safeValue (response, 'result', []);
        const result = [];
        for (let i = 0; i < markets.length; i++) {
            const market = markets[i];
            const id = this.safeString (market, 'name');
            const baseId = this.safeString (market, 'base_currency');
            const quoteId = this.safeString (market, 'quote_currency');
            const base = this.safeCurrencyCode (baseId);
            const quote = this.safeCurrencyCode (quoteId);
            const symbol = base + '/' + quote;
            const lotSizeFilter = this.safeValue (market, 'lot_size_filter', {});
            const priceFilter = this.safeValue (market, 'price_filter', {});
            const precision = {
                'amount': this.safeFloat (lotSizeFilter, 'qty_step'),
                'price': this.safeFloat (priceFilter, 'tick_size'),
            };
            result.push ({
                'id': id,
                'symbol': symbol,
                'base': base,
                'quote': quote,
                'active': undefined,
                'precision': precision,
                'taker': this.safeFloat (market, 'taker_fee'),
                'maker': this.safeFloat (market, 'maker_fee'),
                'limits': {
                    'amount': {
                        'min': this.safeFloat (lotSizeFilter, 'min_trading_qty'),
                        'max': this.safeFloat (lotSizeFilter, 'max_trading_qty'),
                    },
                    'price': {
                        'min': this.safeFloat (priceFilter, 'min_price'),
                        'max': this.safeFloat (priceFilter, 'max_price'),
                    },
                    'cost': {
                        'min': undefined,
                        'max': undefined,
                    },
                },
                'type': 'future',
                'spot': false,
                'future': true,
                'option': false,
                'info': market,
            });
        }
        return result;
    }

    async fetchBalance (params = {}) {
        await this.loadMarkets ();
        const defaultCode = this.safeValue (this.options, 'code', 'BTC');
        const options = this.safeValue (this.options, 'fetchBalance', {});
        const code = this.safeValue (options, 'code', defaultCode);
        const currency = this.currency (code);
        const request = {
            'coin': currency['id'],
        };
        const response = await this.privateGetWalletBalance (this.extend (request, params));
        //
        //     {
        //         ret_code: 0,
        //         ret_msg: 'OK',
        //         ext_code: '',
        //         ext_info: '',
        //         result: {
        //             BTC: {
        //                 equity: 0,
        //                 available_balance: 0,
        //                 used_margin: 0,
        //                 order_margin: 0,
        //                 position_margin: 0,
        //                 occ_closing_fee: 0,
        //                 occ_funding_fee: 0,
        //                 wallet_balance: 0,
        //                 realised_pnl: 0,
        //                 unrealised_pnl: 0,
        //                 cum_realised_pnl: 0,
        //                 given_cash: 0,
        //                 service_cash: 0
        //             }
        //         },
        //         time_now: '1583937810.370020',
        //         rate_limit_status: 119,
        //         rate_limit_reset_ms: 1583937810367,
        //         rate_limit: 120
        //     }
        //
        const result = {
            'info': response,
        };
        const balances = this.safeValue (response, 'result', {});
        const currencyIds = Object.keys (balances);
        for (let i = 0; i < currencyIds.length; i++) {
            const currencyId = currencyIds[i];
            const balance = balances[currencyId];
            const code = this.safeCurrencyCode (currencyId);
            const account = this.account ();
            account['free'] = this.safeFloat (balance, 'available_balance');
            account['used'] = this.safeFloat (balance, 'used_margin');
            account['total'] = this.safeFloat (balance, 'equity');
            result[code] = account;
        }
        return this.parseBalance (result);
    }

    parseTicker (ticker, market = undefined) {
        //
        // fetchTicker
        //
        //     {
        //         symbol: 'BTCUSD',
        //         bid_price: '7680',
        //         ask_price: '7680.5',
        //         last_price: '7680.00',
        //         last_tick_direction: 'MinusTick',
        //         prev_price_24h: '7870.50',
        //         price_24h_pcnt: '-0.024204',
        //         high_price_24h: '8035.00',
        //         low_price_24h: '7671.00',
        //         prev_price_1h: '7780.00',
        //         price_1h_pcnt: '-0.012853',
        //         mark_price: '7683.27',
        //         index_price: '7682.74',
        //         open_interest: 188829147,
        //         open_value: '23670.06',
        //         total_turnover: '25744224.90',
        //         turnover_24h: '102997.83',
        //         total_volume: 225448878806,
        //         volume_24h: 809919408,
        //         funding_rate: '0.0001',
        //         predicted_funding_rate: '0.0001',
        //         next_funding_time: '2020-03-12T00:00:00Z',
        //         countdown_hour: 7
        //     }
        //
        const timestamp = undefined;
        const marketId = this.safeString (ticker, 'symbol');
        let symbol = marketId;
        if (marketId in this.markets_by_id) {
            market = this.markets_by_id[marketId];
        }
        if ((symbol === undefined) && (market !== undefined)) {
            symbol = market['symbol'];
        }
        const last = this.safeFloat2 (ticker, 'last_price');
        const open = this.safeFloat (ticker, 'prev_price_24h')
        let percentage = this.safeFloat (ticker, 'price_24h_pcnt');
        if (percentage !== undefined) {
            percentage *= 100;
        }
        let change = undefined;
        let average = undefined;
        if ((last !== undefined) && (open !== undefined)) {
            change = last - open;
            average = this.sum (open, last) / 2;
        }
        const baseVolume = this.safeFloat (ticker, 'turnover_24h');
        const quoteVolume = this.safeFloat (ticker, 'volume_24h');
        let vwap = undefined;
        if (quoteVolume !== undefined && baseVolume !== undefined) {
            vwap = quoteVolume / baseVolume;
        }
        return {
            'symbol': symbol,
            'timestamp': timestamp,
            'datetime': this.iso8601 (timestamp),
            'high': this.safeFloat2 (ticker, 'high_price_24h'),
            'low': this.safeFloat2 (ticker, 'low_price_24h'),
            'bid': this.safeFloat2 (ticker, 'bid_price'),
            'bidVolume': this.safeFloat (ticker, 'best_bid_amount'),
            'ask': this.safeFloat2 (ticker, 'ask_price'),
            'askVolume': this.safeFloat (ticker, 'best_ask_amount'),
            'vwap': vwap,
            'open': open,
            'close': last,
            'last': last,
            'previousClose': undefined,
            'change': change,
            'percentage': percentage,
            'average': average,
            'baseVolume': baseVolume,
            'quoteVolume': quoteVolume,
            'info': ticker,
        };
    }

    async fetchTicker (symbol, params = {}) {
        await this.loadMarkets ();
        const market = this.market (symbol);
        const request = {
            'symbol': market['id'],
        };
        const response = await this.publicGetTickers (this.extend (request, params));
        //
        //     {
        //         ret_code: 0,
        //         ret_msg: 'OK',
        //         ext_code: '',
        //         ext_info: '',
        //         result: [
        //             {
        //                 symbol: 'BTCUSD',
        //                 bid_price: '7680',
        //                 ask_price: '7680.5',
        //                 last_price: '7680.00',
        //                 last_tick_direction: 'MinusTick',
        //                 prev_price_24h: '7870.50',
        //                 price_24h_pcnt: '-0.024204',
        //                 high_price_24h: '8035.00',
        //                 low_price_24h: '7671.00',
        //                 prev_price_1h: '7780.00',
        //                 price_1h_pcnt: '-0.012853',
        //                 mark_price: '7683.27',
        //                 index_price: '7682.74',
        //                 open_interest: 188829147,
        //                 open_value: '23670.06',
        //                 total_turnover: '25744224.90',
        //                 turnover_24h: '102997.83',
        //                 total_volume: 225448878806,
        //                 volume_24h: 809919408,
        //                 funding_rate: '0.0001',
        //                 predicted_funding_rate: '0.0001',
        //                 next_funding_time: '2020-03-12T00:00:00Z',
        //                 countdown_hour: 7
        //             }
        //         ],
        //         time_now: '1583948195.818255'
        //     }
        //
        const result = this.safeValue (response, 'result');
        return this.parseTicker (result, market);
    }

    async fetchTickers (symbols = undefined, params = {}) {
        await this.loadMarkets ();
        const response = await this.publicGetTickers (params);
        //
        //     {
        //         ret_code: 0,
        //         ret_msg: 'OK',
        //         ext_code: '',
        //         ext_info: '',
        //         result: [
        //             {
        //                 symbol: 'BTCUSD',
        //                 bid_price: '7680',
        //                 ask_price: '7680.5',
        //                 last_price: '7680.00',
        //                 last_tick_direction: 'MinusTick',
        //                 prev_price_24h: '7870.50',
        //                 price_24h_pcnt: '-0.024204',
        //                 high_price_24h: '8035.00',
        //                 low_price_24h: '7671.00',
        //                 prev_price_1h: '7780.00',
        //                 price_1h_pcnt: '-0.012853',
        //                 mark_price: '7683.27',
        //                 index_price: '7682.74',
        //                 open_interest: 188829147,
        //                 open_value: '23670.06',
        //                 total_turnover: '25744224.90',
        //                 turnover_24h: '102997.83',
        //                 total_volume: 225448878806,
        //                 volume_24h: 809919408,
        //                 funding_rate: '0.0001',
        //                 predicted_funding_rate: '0.0001',
        //                 next_funding_time: '2020-03-12T00:00:00Z',
        //                 countdown_hour: 7
        //             }
        //         ],
        //         time_now: '1583948195.818255'
        //     }
        //
        const result = this.safeValue (response, 'result', []);
        const tickers = {};
        for (let i = 0; i < result.length; i++) {
            const ticker = this.parseTicker (result[i]);
            const symbol = ticker['symbol'];
            tickers[symbol] = ticker;
        }
        return this.filterByArray (tickers, 'symbol', symbols);
    }

    parseOHLCV (ohlcv, market = undefined, timeframe = '1m', since = undefined, limit = undefined) {
        //
        //     {
        //         symbol: 'BTCUSD',
        //         interval: '1',
        //         open_time: 1583952540,
        //         open: '7760.5',
        //         high: '7764',
        //         low: '7757',
        //         close: '7763.5',
        //         volume: '1259766',
        //         turnover: '162.32773718999994'
        //     },
        //
        return [
            this.safeTimestamp (ohlcv, 'open_time'),
            this.safeFloat (ohlcv, 'open'),
            this.safeFloat (ohlcv, 'high'),
            this.safeFloat (ohlcv, 'low'),
            this.safeFloat (ohlcv, 'close'),
            this.safeFloat (ohlcv, 'turnover'),
        ];
    }

    async fetchOHLCV (symbol, timeframe = '1m', since = undefined, limit = undefined, params = {}) {
        await this.loadMarkets ();
        const market = this.market (symbol);
        const request = {
            'symbol': market['id'],
            'interval': this.timeframes[timeframe],
        };
        const duration = this.parseTimeframe (timeframe);
        const now = this.seconds ();
        if (since === undefined) {
            if (limit === undefined) {
                throw new ArgumentsRequired (this.id + ' fetchOHLCV requires a since argument or a limit argument');
            } else {
                request['from'] = now - limit * duration;
            }
        } else {
            request['from'] = parseInt (since / 1000);
        }
        if (limit !== undefined) {
            request['limit'] = limit; // max 200, default 200
        }
        const response = await this.publicGetKlineList (this.extend (request, params));
        //     {
        //         ret_code: 0,
        //         ret_msg: 'OK',
        //         ext_code: '',
        //         ext_info: '',
        //         result: [
        //             {
        //                 symbol: 'BTCUSD',
        //                 interval: '1',
        //                 open_time: 1583952540,
        //                 open: '7760.5',
        //                 high: '7764',
        //                 low: '7757',
        //                 close: '7763.5',
        //                 volume: '1259766',
        //                 turnover: '162.32773718999994'
        //             },
        //         ],
        //         time_now: '1583953082.397330'
        //     }
        const result = this.safeValue (response, 'result', {});
        return this.parseOHLCVs (result, market, timeframe, since, limit);
    }

    parseTrade (trade, market = undefined) {
        //
        // fetchTrades (public)
        //
        //     {
        //         id: 43785688,
        //         symbol: 'BTCUSD',
        //         price: 7786,
        //         qty: 67,
        //         side: 'Sell',
        //         time: '2020-03-11T19:18:30.123Z'
        //     }
        //
        // fetchMyTrades, fetchOrderTrades (private)
        //
        //
        //
        const id = this.safeString (trade, 'id');
        let symbol = undefined;
        const marketId = this.safeString (trade, 'symbol');
        if (marketId in this.markets_by_id) {
            market = this.markets_by_id[marketId];
            symbol = market['symbol'];
        }
        if ((symbol === undefined) && (market !== undefined)) {
            symbol = market['symbol'];
        }
        const timestamp = this.parse8601 (this.safeString (trade, 'time'));
        const side = this.safeStringLower (trade, 'side');
        const price = this.safeFloat (trade, 'price');
        const amount = this.safeFloat (trade, 'qty');
        let cost = undefined;
        if (amount !== undefined) {
            if (price !== undefined) {
                cost = amount * price;
            }
        }
        return {
            'id': id,
            'info': trade,
            'timestamp': timestamp,
            'datetime': this.iso8601 (timestamp),
            'symbol': symbol,
            'order': undefined,
            'type': undefined,
            'side': side,
            'takerOrMaker': undefined,
            'price': price,
            'amount': amount,
            'cost': cost,
            'fee': undefined,
        };
    }

    async fetchTrades (symbol, since = undefined, limit = undefined, params = {}) {
        await this.loadMarkets ();
        const market = this.market (symbol);
        const request = {
            'symbol': market['id'],
            // 'from': 123, // from id
        };
        if (limit !== undefined) {
            request['count'] = limit; // default 500, max 1000
        }
        const response = await this.publicGetTradingRecords (this.extend (request, params));
        //
        //     {
        //         ret_code: 0,
        //         ret_msg: 'OK',
        //         ext_code: '',
        //         ext_info: '',
        //         result: [
        //             {
        //                 id: 43785688,
        //                 symbol: 'BTCUSD',
        //                 price: 7786,
        //                 qty: 67,
        //                 side: 'Sell',
        //                 time: '2020-03-11T19:18:30.123Z'
        //             },
        //         ],
        //         time_now: '1583954313.393362'
        //     }
        //
        const result = this.safeValue (response, 'result', {});
        return this.parseTrades (result, market, since, limit);
    }

    async fetchOrderBook (symbol, limit = undefined, params = {}) {
        await this.loadMarkets ();
        const market = this.market (symbol);
        const request = {
            'instrument_name': market['id'],
        };
        if (limit !== undefined) {
            request['depth'] = limit;
        }
        const response = await this.publicGetGetOrderBook (this.extend (request, params));
        //
        //     {
        //         jsonrpc: '2.0',
        //         result: {
        //             timestamp: 1583781354740,
        //             stats: { volume: 61249.66735634, low: 7631.5, high: 8311.5 },
        //             state: 'open',
        //             settlement_price: 7903.21,
        //             open_interest: 111536690,
        //             min_price: 7695.13,
        //             max_price: 7929.49,
        //             mark_price: 7813.06,
        //             last_price: 7814.5,
        //             instrument_name: 'BTC-PERPETUAL',
        //             index_price: 7810.12,
        //             funding_8h: 0.0000031,
        //             current_funding: 0,
        //             change_id: 17538025952,
        //             bids: [
        //                 [7814, 351820],
        //                 [7813.5, 207490],
        //                 [7813, 32160],
        //             ],
        //             best_bid_price: 7814,
        //             best_bid_amount: 351820,
        //             best_ask_price: 7814.5,
        //             best_ask_amount: 11880,
        //             asks: [
        //                 [7814.5, 11880],
        //                 [7815, 18100],
        //                 [7815.5, 2640],
        //             ],
        //         },
        //         usIn: 1583781354745804,
        //         usOut: 1583781354745932,
        //         usDiff: 128,
        //         testnet: false
        //     }
        //
        const result = this.safeValue (response, 'result', {});
        const timestamp = this.safeInteger (result, 'timestamp');
        const nonce = this.safeInteger (result, 'change_id');
        const orderbook = this.parseOrderBook (result, timestamp);
        orderbook['nonce'] = nonce;
        return orderbook;
    }

    parseOrderStatus (status) {
        const statuses = {
            'open': 'open',
            'cancelled': 'canceled',
            'filled': 'closed',
            'rejected': 'rejected',
            // 'untriggered': 'open',
        };
        return this.safeString (statuses, status, status);
    }

    parseOrder (order, market = undefined) {
        //
        // createOrder
        //
        //     {
        //         "time_in_force": "good_til_cancelled",
        //         "reduce_only": false,
        //         "profit_loss": 0,
        //         "price": "market_price",
        //         "post_only": false,
        //         "order_type": "market",
        //         "order_state": "filled",
        //         "order_id": "ETH-349249",
        //         "max_show": 40,
        //         "last_update_timestamp": 1550657341322,
        //         "label": "market0000234",
        //         "is_liquidation": false,
        //         "instrument_name": "ETH-PERPETUAL",
        //         "filled_amount": 40,
        //         "direction": "buy",
        //         "creation_timestamp": 1550657341322,
        //         "commission": 0.000139,
        //         "average_price": 143.81,
        //         "api": true,
        //         "amount": 40,
        //         "trades": [], // injected by createOrder
        //     }
        //
        const timestamp = this.safeInteger (order, 'creation_timestamp');
        const lastUpdate = this.safeInteger (order, 'last_update_timestamp');
        const id = this.safeString (order, 'order_id');
        const price = this.safeFloat (order, 'price');
        const average = this.safeFloat (order, 'average_price');
        const amount = this.safeFloat (order, 'amount');
        const filled = this.safeFloat (order, 'filled_amount');
        let lastTradeTimestamp = undefined;
        if (filled !== undefined) {
            if (filled > 0) {
                lastTradeTimestamp = lastUpdate;
            }
        }
        let remaining = undefined;
        let cost = undefined;
        if (filled !== undefined) {
            if (amount !== undefined) {
                remaining = amount - filled;
            }
            if (price !== undefined) {
                cost = price * filled;
            }
        }
        const status = this.parseOrderStatus (this.safeString (order, 'order_state'));
        const marketId = this.safeString (order, 'instrument_name');
        let symbol = undefined;
        if (marketId in this.markets_by_id) {
            market = this.markets_by_id[marketId];
            symbol = market['symbol'];
        }
        const side = this.safeStringLower (order, 'direction');
        let feeCost = this.safeFloat (order, 'commission');
        let fee = undefined;
        if (feeCost !== undefined) {
            feeCost = Math.abs (feeCost);
            fee = {
                'cost': feeCost,
                'currency': 'BTC',
            };
        }
        const type = this.safeString (order, 'order_type');
        // injected in createOrder
        let trades = this.safeValue (order, 'trades');
        if (trades !== undefined) {
            trades = this.parseTrades (trades, market);
        }
        return {
            'info': order,
            'id': id,
            'timestamp': timestamp,
            'datetime': this.iso8601 (timestamp),
            'lastTradeTimestamp': lastTradeTimestamp,
            'symbol': symbol,
            'type': type,
            'side': side,
            'price': price,
            'amount': amount,
            'cost': cost,
            'average': average,
            'filled': filled,
            'remaining': remaining,
            'status': status,
            'fee': fee,
            'trades': trades,
        };
    }

    async fetchOrder (id, symbol = undefined, params = {}) {
        await this.loadMarkets ();
        const request = {
            'order_id': id,
        };
        const response = await this.privateGetGetOrderState (this.extend (request, params));
        //
        //     {
        //         "jsonrpc": "2.0",
        //         "id": 4316,
        //         "result": {
        //             "time_in_force": "good_til_cancelled",
        //             "reduce_only": false,
        //             "profit_loss": 0.051134,
        //             "price": 118.94,
        //             "post_only": false,
        //             "order_type": "limit",
        //             "order_state": "filled",
        //             "order_id": "ETH-331562",
        //             "max_show": 37,
        //             "last_update_timestamp": 1550219810944,
        //             "label": "",
        //             "is_liquidation": false,
        //             "instrument_name": "ETH-PERPETUAL",
        //             "filled_amount": 37,
        //             "direction": "sell",
        //             "creation_timestamp": 1550219749176,
        //             "commission": 0.000031,
        //             "average_price": 118.94,
        //             "api": false,
        //             "amount": 37
        //         }
        //     }
        //
        const result = this.safeValue (response, 'result');
        return this.parseOrder (result);
    }

    async createOrder (symbol, type, side, amount, price = undefined, params = {}) {
        await this.loadMarkets ();
        const market = this.market (symbol);
        const request = {
            'instrument_name': market['id'],
            // for perpetual and futures the amount is in USD
            // for options it is in corresponding cryptocurrency contracts, e.g., BTC or ETH
            'amount': this.amountToPrecision (symbol, amount),
            'type': type, // limit, stop_limit, market, stop_market, default is limit
            // 'label': 'string', // user-defined label for the order (maximum 64 characters)
            // 'price': this.priceToPrecision (symbol, 123.45), // only for limit and stop_limit orders
            // 'time_in_force' : 'good_til_cancelled', // fill_or_kill, immediate_or_cancel
            // 'max_show': 123.45, // max amount within an order to be shown to other customers, 0 for invisible order
            // 'post_only': false, // if the new price would cause the order to be filled immediately (as taker), the price will be changed to be just below the spread.
            // 'reject_post_only': false, // if true the order is put to order book unmodified or request is rejected
            // 'reduce_only': false, // if true, the order is intended to only reduce a current position
            // 'stop_price': false, // stop price, required for stop_limit orders
            // 'trigger': 'index_price', // mark_price, last_price, required for stop_limit orders
            // 'advanced': 'usd', // 'implv', advanced option order type, options only
        };
        let priceIsRequired = false;
        let stopPriceIsRequired = false;
        if (type === 'limit') {
            priceIsRequired = true;
        } else if (type === 'stop_limit') {
            priceIsRequired = true;
            stopPriceIsRequired = true;
        }
        if (priceIsRequired) {
            if (price !== undefined) {
                request['price'] = this.priceToPrecision (symbol, price);
            } else {
                throw new ArgumentsRequired (this.id + ' createOrder requires a price argument for a ' + type + ' order');
            }
        }
        if (stopPriceIsRequired) {
            const stopPrice = this.safeFloat2 (params, 'stop_price', 'stopPrice');
            if (stopPrice === undefined) {
                throw new ArgumentsRequired (this.id + ' createOrder requires a stop_price or stopPrice param for a ' + type + ' order');
            } else {
                request['stop_price'] = this.priceToPrecision (symbol, stopPrice);
            }
        }
        const method = 'privateGet' + this.capitalize (side);
        const response = await this[method] (this.extend (request, params));
        //
        //     {
        //         "jsonrpc": "2.0",
        //         "id": 5275,
        //         "result": {
        //             "trades": [
        //                 {
        //                     "trade_seq": 14151,
        //                     "trade_id": "ETH-37435",
        //                     "timestamp": 1550657341322,
        //                     "tick_direction": 2,
        //                     "state": "closed",
        //                     "self_trade": false,
        //                     "price": 143.81,
        //                     "order_type": "market",
        //                     "order_id": "ETH-349249",
        //                     "matching_id": null,
        //                     "liquidity": "T",
        //                     "label": "market0000234",
        //                     "instrument_name": "ETH-PERPETUAL",
        //                     "index_price": 143.73,
        //                     "fee_currency": "ETH",
        //                     "fee": 0.000139,
        //                     "direction": "buy",
        //                     "amount": 40
        //                 }
        //             ],
        //             "order": {
        //                 "time_in_force": "good_til_cancelled",
        //                 "reduce_only": false,
        //                 "profit_loss": 0,
        //                 "price": "market_price",
        //                 "post_only": false,
        //                 "order_type": "market",
        //                 "order_state": "filled",
        //                 "order_id": "ETH-349249",
        //                 "max_show": 40,
        //                 "last_update_timestamp": 1550657341322,
        //                 "label": "market0000234",
        //                 "is_liquidation": false,
        //                 "instrument_name": "ETH-PERPETUAL",
        //                 "filled_amount": 40,
        //                 "direction": "buy",
        //                 "creation_timestamp": 1550657341322,
        //                 "commission": 0.000139,
        //                 "average_price": 143.81,
        //                 "api": true,
        //                 "amount": 40
        //             }
        //         }
        //     }
        //
        const result = this.safeValue (response, 'result', {});
        const order = this.safeValue (result, 'order');
        const trades = this.safeValue (result, 'trades', []);
        order['trades'] = trades;
        return this.parseOrder (order, market);
    }

    async editOrder (id, symbol, type, side, amount = undefined, price = undefined, params = {}) {
        if (amount === undefined) {
            throw new ArgumentsRequired (this.id + ' editOrder requires an amount argument');
        }
        if (price === undefined) {
            throw new ArgumentsRequired (this.id + ' editOrder requires a price argument');
        }
        await this.loadMarkets ();
        const request = {
            'order_id': id,
            // for perpetual and futures the amount is in USD
            // for options it is in corresponding cryptocurrency contracts, e.g., BTC or ETH
            'amount': this.amountToPrecision (symbol, amount),
            'price': this.priceToPrecision (symbol, price), // required
            // 'post_only': false, // if the new price would cause the order to be filled immediately (as taker), the price will be changed to be just below the spread.
            // 'reject_post_only': false, // if true the order is put to order book unmodified or request is rejected
            // 'reduce_only': false, // if true, the order is intended to only reduce a current position
            // 'stop_price': false, // stop price, required for stop_limit orders
            // 'advanced': 'usd', // 'implv', advanced option order type, options only
        };
        const response = await this.privateGetEdit (this.extend (request, params));
        const result = this.safeValue (response, 'result', {});
        const order = this.safeValue (result, 'order');
        const trades = this.safeValue (result, 'trades', []);
        order['trades'] = trades;
        return this.parseOrder (order);
    }

    async cancelOrder (id, symbol = undefined, params = {}) {
        await this.loadMarkets ();
        const request = {
            'order_id': id,
        };
        const response = await this.privateGetCancel (this.extend (request, params));
        const result = this.safeValue (response, 'result', {});
        return this.parseOrder (result);
    }

    async cancelAllOrders (symbol = undefined, params = {}) {
        await this.loadMarkets ();
        const request = {};
        let method = undefined;
        if (symbol === undefined) {
            method = 'privateGetCancelAll';
        } else {
            method = 'privateGetCancelAllByInstrument';
            const market = this.market (symbol);
            request['instrument_name'] = market['id'];
        }
        const response = await this[method] (this.extend (request, params));
        return response;
    }

    async fetchOpenOrders (symbol = undefined, since = undefined, limit = undefined, params = {}) {
        await this.loadMarkets ();
        const request = {};
        let market = undefined;
        let method = undefined;
        if (symbol === undefined) {
            const defaultCode = this.safeValue (this.options, 'code', 'BTC');
            const options = this.safeValue (this.options, 'fetchOpenOrders', {});
            const code = this.safeValue (options, 'code', defaultCode);
            const currency = this.currency (code);
            request['currency'] = currency['id'];
            method = 'privateGetGetOpenOrdersByCurrency';
        } else {
            market = this.market (symbol);
            request['instrument_name'] = market['id'];
            method = 'privateGetGetOpenOrdersByInstrument';
        }
        const response = await this[method] (this.extend (request, params));
        const result = this.safeValue (response, 'result', []);
        return this.parseOrders (result, market, since, limit);
    }

    async fetchClosedOrders (symbol = undefined, since = undefined, limit = undefined, params = {}) {
        await this.loadMarkets ();
        const request = {};
        let market = undefined;
        let method = undefined;
        if (symbol === undefined) {
            const defaultCode = this.safeValue (this.options, 'code', 'BTC');
            const options = this.safeValue (this.options, 'fetchClosedOrders', {});
            const code = this.safeValue (options, 'code', defaultCode);
            const currency = this.currency (code);
            request['currency'] = currency['id'];
            method = 'privateGetGetOrderHistoryByCurrency';
        } else {
            market = this.market (symbol);
            request['instrument_name'] = market['id'];
            method = 'privateGetGetOrderHistoryByInstrument';
        }
        const response = await this[method] (this.extend (request, params));
        const result = this.safeValue (response, 'result', []);
        return this.parseOrders (result, market, since, limit);
    }

    async fetchOrderTrades (id, symbol = undefined, since = undefined, limit = undefined, params = {}) {
        await this.loadMarkets ();
        const request = {
            'order_id': id,
        };
        const response = await this.privateGetGetUserTradesByOrder (this.extend (request, params));
        //
        //     {
        //         "jsonrpc": "2.0",
        //         "id": 9367,
        //         "result": {
        //             "trades": [
        //                 {
        //                     "trade_seq": 3,
        //                     "trade_id": "ETH-34066",
        //                     "timestamp": 1550219814585,
        //                     "tick_direction": 1,
        //                     "state": "open",
        //                     "self_trade": false,
        //                     "reduce_only": false,
        //                     "price": 0.04,
        //                     "post_only": false,
        //                     "order_type": "limit",
        //                     "order_id": "ETH-334607",
        //                     "matching_id": null,
        //                     "liquidity": "M",
        //                     "iv": 56.83,
        //                     "instrument_name": "ETH-22FEB19-120-C",
        //                     "index_price": 121.37,
        //                     "fee_currency": "ETH",
        //                     "fee": 0.0011,
        //                     "direction": "buy",
        //                     "amount": 11
        //                 },
        //             ],
        //             "has_more": true
        //         }
        //     }
        //
        const result = this.safeValue (response, 'result', {});
        const trades = this.safeValue (result, 'trades', []);
        return this.parseTrades (trades, undefined, since, limit);
    }

    async fetchMyTrades (symbol = undefined, since = undefined, limit = undefined, params = {}) {
        await this.loadMarkets ();
        const request = {
            'include_old': true,
        };
        let market = undefined;
        let method = undefined;
        if (symbol === undefined) {
            const defaultCode = this.safeValue (this.options, 'code', 'BTC');
            const options = this.safeValue (this.options, 'fetchMyTrades', {});
            const code = this.safeValue (options, 'code', defaultCode);
            const currency = this.currency (code);
            request['currency'] = currency['id'];
            if (since === undefined) {
                method = 'privateGetGetUserTradesByCurrency';
            } else {
                method = 'privateGetGetUserTradesByCurrencyAndTime';
                request['start_timestamp'] = since;
            }
        } else {
            market = this.market (symbol);
            request['instrument_name'] = market['id'];
            if (since === undefined) {
                method = 'privateGetGetUserTradesByInstrument';
            } else {
                method = 'privateGetGetUserTradesByInstrumentAndTime';
                request['start_timestamp'] = since;
            }
        }
        if (limit !== undefined) {
            request['count'] = limit; // default 10
        }
        const response = await this[method] (this.extend (request, params));
        //
        //     {
        //         "jsonrpc": "2.0",
        //         "id": 9367,
        //         "result": {
        //             "trades": [
        //                 {
        //                     "trade_seq": 3,
        //                     "trade_id": "ETH-34066",
        //                     "timestamp": 1550219814585,
        //                     "tick_direction": 1,
        //                     "state": "open",
        //                     "self_trade": false,
        //                     "reduce_only": false,
        //                     "price": 0.04,
        //                     "post_only": false,
        //                     "order_type": "limit",
        //                     "order_id": "ETH-334607",
        //                     "matching_id": null,
        //                     "liquidity": "M",
        //                     "iv": 56.83,
        //                     "instrument_name": "ETH-22FEB19-120-C",
        //                     "index_price": 121.37,
        //                     "fee_currency": "ETH",
        //                     "fee": 0.0011,
        //                     "direction": "buy",
        //                     "amount": 11
        //                 },
        //             ],
        //             "has_more": true
        //         }
        //     }
        //
        const result = this.safeValue (response, 'result', {});
        const trades = this.safeValue (result, 'trades', []);
        return this.parseTrades (trades, market, since, limit);
    }

    async fetchDeposits (code = undefined, since = undefined, limit = undefined, params = {}) {
        if (code === undefined) {
            throw new ArgumentsRequired (this.id + ' fetchWithdrawals() requires a currency code argument');
        }
        await this.loadMarkets ();
        const currency = this.currency (code);
        const request = {
            'currency': currency['id'],
        };
        if (limit !== undefined) {
            request['count'] = limit;
        }
        const response = await this.privateGetGetDeposits (this.extend (request, params));
        //
        //     {
        //         "jsonrpc": "2.0",
        //         "id": 5611,
        //         "result": {
        //             "count": 1,
        //             "data": [
        //                 {
        //                     "address": "2N35qDKDY22zmJq9eSyiAerMD4enJ1xx6ax",
        //                     "amount": 5,
        //                     "currency": "BTC",
        //                     "received_timestamp": 1549295017670,
        //                     "state": "completed",
        //                     "transaction_id": "230669110fdaf0a0dbcdc079b6b8b43d5af29cc73683835b9bc6b3406c065fda",
        //                     "updated_timestamp": 1549295130159
        //                 }
        //             ]
        //         }
        //     }
        //
        const result = this.safeValue (response, 'result', {});
        const data = this.safeValue (result, 'data', []);
        return this.parseTransactions (data, currency, since, limit, params);
    }

    async fetchWithdrawals (code = undefined, since = undefined, limit = undefined, params = {}) {
        if (code === undefined) {
            throw new ArgumentsRequired (this.id + ' fetchWithdrawals() requires a currency code argument');
        }
        await this.loadMarkets ();
        const currency = this.currency (code);
        const request = {
            'currency': currency['id'],
        };
        if (limit !== undefined) {
            request['count'] = limit;
        }
        const response = await this.privateGetGetWithdrawals (this.extend (request, params));
        //
        //     {
        //         "jsonrpc": "2.0",
        //         "id": 2745,
        //         "result": {
        //             "count": 1,
        //             "data": [
        //                 {
        //                     "address": "2NBqqD5GRJ8wHy1PYyCXTe9ke5226FhavBz",
        //                     "amount": 0.5,
        //                     "confirmed_timestamp": null,
        //                     "created_timestamp": 1550571443070,
        //                     "currency": "BTC",
        //                     "fee": 0.0001,
        //                     "id": 1,
        //                     "priority": 0.15,
        //                     "state": "unconfirmed",
        //                     "transaction_id": null,
        //                     "updated_timestamp": 1550571443070
        //                 }
        //             ]
        //         }
        //     }
        //
        const result = this.safeValue (response, 'result', {});
        const data = this.safeValue (result, 'data', []);
        return this.parseTransactions (data, currency, since, limit, params);
    }

    parseTransactionStatus (status) {
        const statuses = {
            'completed': 'ok',
            'unconfirmed': 'pending',
        };
        return this.safeString (statuses, status, status);
    }

    parseTransaction (transaction, currency = undefined) {
        //
        // fetchWithdrawals
        //
        //     {
        //         "address": "2NBqqD5GRJ8wHy1PYyCXTe9ke5226FhavBz",
        //         "amount": 0.5,
        //         "confirmed_timestamp": null,
        //         "created_timestamp": 1550571443070,
        //         "currency": "BTC",
        //         "fee": 0.0001,
        //         "id": 1,
        //         "priority": 0.15,
        //         "state": "unconfirmed",
        //         "transaction_id": null,
        //         "updated_timestamp": 1550571443070
        //     }
        //
        // fetchDeposits
        //
        //     {
        //         "address": "2N35qDKDY22zmJq9eSyiAerMD4enJ1xx6ax",
        //         "amount": 5,
        //         "currency": "BTC",
        //         "received_timestamp": 1549295017670,
        //         "state": "completed",
        //         "transaction_id": "230669110fdaf0a0dbcdc079b6b8b43d5af29cc73683835b9bc6b3406c065fda",
        //         "updated_timestamp": 1549295130159
        //     }
        //
        const currencyId = this.safeString (transaction, 'currency');
        const code = this.safeCurrencyCode (currencyId, currency);
        const timestamp = this.safeInteger (transaction, 'created_timestamp', 'received_timestamp');
        const updated = this.safeInteger (transaction, 'updated_timestamp');
        const status = this.parseTransactionStatus (this.safeString (transaction, 'state'));
        const address = this.safeString (transaction, 'address');
        const feeCost = this.safeFloat (transaction, 'fee');
        let type = 'deposit';
        let fee = undefined;
        if (feeCost !== undefined) {
            type = 'withdrawal';
            fee = {
                'cost': feeCost,
                'currency': code,
            };
        }
        return {
            'info': transaction,
            'id': this.safeString (transaction, 'id'),
            'txid': this.safeString (transaction, 'transaction_id'),
            'timestamp': timestamp,
            'datetime': this.iso8601 (timestamp),
            'address': address,
            'addressTo': address,
            'addressFrom': undefined,
            'tag': undefined,
            'tagTo': undefined,
            'TagFrom': undefined,
            'type': type,
            'amount': this.safeFloat (transaction, 'amount'),
            'currency': code,
            'status': status,
            'updated': updated,
            'fee': fee,
        };
    }

    async withdraw (code, amount, address, tag = undefined, params = {}) {
        this.checkAddress (address);
        await this.loadMarkets ();
        const currency = this.currency (code);
        const request = {
            'currency': currency['id'],
            'address': address, // must be in the address book
            'amount': amount,
            // 'priority': 'high', // low, mid, high, very_high, extreme_high, insane
            // 'tfa': '123456', // if enabled
        };
        if (this.twofa !== undefined) {
            request['tfa'] = this.oath ();
        }
        const response = await this.privateGetWithdraw (this.extend (request, params));
        return {
            'info': response,
            'id': this.safeString (response, 'id'),
        };
    }

    sign (path, api = 'public', method = 'GET', params = {}, headers = undefined, body = undefined) {
        let url = this.urls['api'];
        let request = path;
        // public v2
        if (api === 'public') {
            request = '/' + this.version + '/' + api + '/' + request;
            if (Object.keys (params).length) {
                request += '?' + this.urlencode (params);
            }
        } else {
            this.checkRequiredCredentials ();
            if (api === 'openapi') {
                request = '/open-api/' + request;
            } else if (api === 'private') {
                // private v2
                request = '/' + this.version + '/' + api + '/' + request;
            } else {
                // position, user
                request += '/' + api + '/' + request;
            }
            const timestamp = this.nonce ();
            const query = this.extend (params, {
                'api_key': this.apiKey,
                'recvWindow': this.options['recvWindow'],
                'timestamp': timestamp,
            });
            const auth = this.urlencode (this.keysort (query));
            const signature = this.hmac (this.encode (auth), this.encode (this.secret));
            if (method === 'POST') {
                body = this.json (this.extend (query, {
                    'sign': signature,
                }));
                headers['Content-Type'] = 'application/json';
            } else {
                request += '?' + auth + '&sign=' + signature;
            }
        }
        url += request;
        return { 'url': url, 'method': method, 'body': body, 'headers': headers };
    }

    handleErrors (httpCode, reason, url, method, headers, body, response, requestHeaders, requestBody) {
        if (!response) {
            return; // fallback to default error handler
        }
        //
        //     {
        //         ret_code: 10001,
        //         ret_msg: 'ReadMapCB: expect { or n, but found \u0000, error ' +
        //         'found in #0 byte of ...||..., bigger context ' +
        //         '...||...',
        //         ext_code: '',
        //         ext_info: '',
        //         result: null,
        //         time_now: '1583934106.590436'
        //     }
        //
        const errorCode = this.safeValue (response, 'ret_code');
        if (errorCode !== 0) {
            const feedback = this.id + ' ' + body;
            this.throwExactlyMatchedException (this.exceptions, errorCode, feedback);
            throw new ExchangeError (feedback); // unknown message
        }
    }
};
