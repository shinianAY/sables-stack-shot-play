window.__require = function e(t, n, r) {
  function s(o, u) {
    if (!n[o]) {
      if (!t[o]) {
        var b = o.split("/");
        b = b[b.length - 1];
        if (!t[b]) {
          var a = "function" == typeof __require && __require;
          if (!u && a) return a(b, !0);
          if (i) return i(b, !0);
          throw new Error("Cannot find module '" + o + "'");
        }
        o = b;
      }
      var f = n[o] = {
        exports: {}
      };
      t[o][0].call(f.exports, function(e) {
        var n = t[o][1][e];
        return s(n || e);
      }, f, f.exports, e, t, n, r);
    }
    return n[o].exports;
  }
  var i = "function" == typeof __require && __require;
  for (var o = 0; o < r.length; o++) s(r[o]);
  return s;
}({
  AdRewards: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "0bf22xTwzRFMZS+Zsmf9q9Z", "AdRewards");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.curvePrices = exports.adGateFinish = exports.adGateStart = exports.createAdGate = exports.claimGift = exports.onRoundEnd = exports.giftAvailable = exports.giftRemainingMs = exports.migrateGift = exports.createGift = exports.giftReward = exports.currencyAdReward = exports.nextPrice = exports.resultReward = exports.bonusPct = exports.round5 = exports.GIFT_MULTIPLIER = exports.CURRENCY_AD_MULTIPLIER = exports.GIFT_COOLDOWN_MS = exports.FIRST_PRICE_R = exports.PRICE_STEPS = exports.BONUS_LEVEL_MULTIPLIER = exports.RESULT_AD_MULTIPLIER = exports.AD_REWARDS_VERSION = void 0;
    exports.AD_REWARDS_VERSION = 3;
    exports.RESULT_AD_MULTIPLIER = 2;
    exports.BONUS_LEVEL_MULTIPLIER = 3;
    exports.PRICE_STEPS = [ 1, 4, 10, 20 ];
    exports.FIRST_PRICE_R = 2;
    exports.GIFT_COOLDOWN_MS = 18e5;
    exports.CURRENCY_AD_MULTIPLIER = 5;
    exports.GIFT_MULTIPLIER = 5;
    function isNum(v) {
      return "number" === typeof v && isFinite(v);
    }
    function round5(x) {
      return Math.max(5, 5 * Math.round(x / 5));
    }
    exports.round5 = round5;
    function itemsOf(table) {
      return table && Array.isArray(table.items) ? table.items : Array.isArray(table) ? table : [];
    }
    function bonusPct(table, equippedIds) {
      var on = {};
      (equippedIds || []).forEach(function(id) {
        on[id] = true;
      });
      var pct = 0;
      var seen = {};
      itemsOf(table).forEach(function(it) {
        if (!on[it.id] || seen[it.group] || !it.bonus || "coins" !== it.bonus.type || !isNum(it.bonus.pct)) return;
        seen[it.group] = true;
        pct += it.bonus.pct;
      });
      return pct;
    }
    exports.bonusPct = bonusPct;
    function resultReward(levelCoins, pct) {
      var base = Math.max(0, Math.round(levelCoins || 0));
      var total = Math.round(base * (1 + (pct || 0) / 100));
      return {
        base: base,
        skin_bonus: total - base,
        total: total,
        doubled: total * exports.RESULT_AD_MULTIPLIER
      };
    }
    exports.resultReward = resultReward;
    function nextPrice(table, ownedIds) {
      var own = {};
      (ownedIds || []).forEach(function(id) {
        own[id] = true;
      });
      var priced = itemsOf(table).filter(function(it) {
        return "coins" === it.unlock && isNum(it.coins) && it.coins > 0;
      });
      if (!priced.length) return 0;
      var left = priced.filter(function(it) {
        return !own[it.id];
      }).map(function(it) {
        return it.coins;
      });
      return left.length ? Math.min.apply(null, left) : Math.max.apply(null, priced.map(function(it) {
        return it.coins;
      }));
    }
    exports.nextPrice = nextPrice;
    function baseCurrency(B) {
      if (!Number.isSafeInteger(B) || B <= 0 || !Number.isSafeInteger(50 * B)) throw new Error("positive safe integer ordinary base income required");
      return B;
    }
    function currencyAdReward(B) {
      return exports.CURRENCY_AD_MULTIPLIER * baseCurrency(B);
    }
    exports.currencyAdReward = currencyAdReward;
    function giftReward(B) {
      return exports.GIFT_MULTIPLIER * baseCurrency(B);
    }
    exports.giftReward = giftReward;
    function clock(now) {
      if (!Number.isSafeInteger(now) || now < 0) throw new Error("nonnegative millisecond clock required");
      return now;
    }
    function validGift(state) {
      return state && 3 === state.version && Number.isSafeInteger(state.nextClaimAt) && state.nextClaimAt >= 0 && Number.isSafeInteger(state.lastClaimAt) && state.lastClaimAt >= 0 && (0 === state.nextClaimAt && 0 === state.lastClaimAt || state.nextClaimAt === state.lastClaimAt + exports.GIFT_COOLDOWN_MS);
    }
    function createGift(now) {
      void 0 === now && (now = Date.now());
      clock(now);
      return {
        version: 3,
        nextClaimAt: 0,
        lastClaimAt: 0
      };
    }
    exports.createGift = createGift;
    function migrateGift(state, now) {
      void 0 === now && (now = Date.now());
      clock(now);
      if (validGift(state)) return __assign({}, state);
      if (state && void 0 === state.version && 1 === state.charges) return createGift(now);
      return {
        version: 3,
        nextClaimAt: clock(now + exports.GIFT_COOLDOWN_MS),
        lastClaimAt: now
      };
    }
    exports.migrateGift = migrateGift;
    function giftRemainingMs(state, now) {
      void 0 === now && (now = Date.now());
      clock(now);
      return validGift(state) ? Math.max(0, state.nextClaimAt - Math.max(now, state.lastClaimAt)) : exports.GIFT_COOLDOWN_MS;
    }
    exports.giftRemainingMs = giftRemainingMs;
    function giftAvailable(state, now) {
      void 0 === now && (now = Date.now());
      return validGift(state) && 0 === giftRemainingMs(state, now);
    }
    exports.giftAvailable = giftAvailable;
    function onRoundEnd(state) {
      return __assign({}, state);
    }
    exports.onRoundEnd = onRoundEnd;
    function claimGift(state, B, table, ownedIds, cleared, now) {
      void 0 === now && (now = Date.now());
      clock(now);
      if (!giftAvailable(state, now)) return {
        coins: 0,
        state: __assign({}, state)
      };
      return {
        coins: giftReward(B),
        state: {
          version: 3,
          nextClaimAt: clock(now + exports.GIFT_COOLDOWN_MS),
          lastClaimAt: now
        }
      };
    }
    exports.claimGift = claimGift;
    function createAdGate() {
      return {
        busy: false,
        paid: 0,
        sequence: 0,
        active: null
      };
    }
    exports.createAdGate = createAdGate;
    function adGateStart(g) {
      if (g.busy) return false;
      var token = Object.freeze({
        request: ++g.sequence
      });
      g.busy = true;
      g.active = token;
      return token;
    }
    exports.adGateStart = adGateStart;
    function adGateFinish(g, token, completed) {
      if (!g.busy || !token || g.active !== token) return false;
      g.active = null;
      g.busy = false;
      if (true !== completed) return false;
      g.paid += 1;
      return true;
    }
    exports.adGateFinish = adGateFinish;
    function curvePrices(R, rarities, pricing) {
      void 0 === pricing && (pricing = "ordinary-levels");
      var config = "string" === typeof pricing ? {
        price_profile: pricing
      } : pricing || {};
      var profile = config.price_profile || "legacy-2r";
      if ("ordinary-levels" !== profile && "legacy-2r" !== profile) throw new Error("unknown price_profile: " + profile);
      if ("ordinary-levels" === profile) {
        var targets_1 = config.price_level_targets || {
          common: 10,
          rare: 20,
          epic: 30,
          legendary: 40,
          limited: 50
        };
        var base_1 = void 0 === config.normal_level_coins ? void 0 === config.coins_per_level ? R : config.coins_per_level : config.normal_level_coins;
        var values_1 = [ "common", "rare", "epic", "legendary" ].map(function(r) {
          return targets_1[r];
        });
        void 0 !== targets_1.limited && values_1.push(targets_1.limited);
        if ("normal-10-50.v1" === config.economy_policy && [ "common", "rare", "epic", "legendary", "limited" ].some(function(r, i) {
          return targets_1[r] !== 10 * (i + 1);
        })) throw new Error("current economy requires 10/20/30/40/50");
        if (!Number.isFinite(base_1) || base_1 <= 0 || values_1.some(function(n, i) {
          return !Number.isFinite(n) || n <= 0 || i > 0 && n <= values_1[i - 1];
        })) throw new Error("positive ordinary income and increasing tier targets required");
        return rarities.map(function(r) {
          if (void 0 === targets_1[r]) throw new Error("unknown rarity: " + r);
          return Math.max(1, Math.round(base_1 * targets_1[r]));
        });
      }
      var rank = {
        common: 0,
        rare: 1,
        epic: 2,
        legendary: 3
      };
      var out = [];
      rarities.forEach(function(r, i) {
        out.push(0 === i ? exports.FIRST_PRICE_R * R : out[i - 1] + exports.PRICE_STEPS[rank[r]] * R);
      });
      return out;
    }
    exports.curvePrices = curvePrices;
    cc._RF.pop();
  }, {} ],
  ArtBundles: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "c1cd8xHHwNFIZP9hAYPIqp7", "ArtBundles");
    "use strict";
    module.exports = {
      background_bg_06: "studio_b",
      txt_COCOA_WALL: "phrases",
      txt_AMBER_NIB: "phrases",
      txt_NEXT: "phrases",
      txt_DEW_NIB: "phrases",
      txt_NIB_SABLE: "phrases",
      background_bg_07: "studio_b",
      txt_MARM_NIB: "phrases",
      background_bg_05: "studio_a",
      txt_SABLE_COLLECTION: "phrases",
      txt_THE_INK_TRAIL: "phrases",
      txt_EVERY_DROP_COUNTS: "phrases",
      txt_FINAL_WALL: "phrases",
      background_bg_10: "studio_b",
      background_bg_04: "studio_a",
      txt_QUILL_SABLE: "phrases",
      txt_OWNED: "phrases",
      txt_CAP_NIB: "phrases",
      txt_EFFECTS_VOLUME: "phrases",
      background_bg_03: "studio_a",
      txt_PRESS_SABLE: "phrases",
      txt_INK_SABLE: "phrases",
      txt_WICK_NIB: "phrases",
      background_bg_02: "studio_a",
      background_preview_bg_10: "studio_b",
      background_preview_bg_04: "studio_a",
      txt_LAST_NIB: "phrases",
      txt_SO_CLOSE: "phrases",
      background_preview_bg_05: "studio_a",
      txt_GARDEN_WALL: "phrases",
      txt_A_QUICK_NOTE: "phrases",
      txt_LEMON_PRESS: "phrases",
      background_preview_bg_07: "studio_b",
      txt_LAMP_WALL: "phrases",
      txt_TAP_A_COLUMN_MERGE_EQUAL_INK: "phrases",
      background_preview_bg_06: "studio_b",
      background_preview_bg_02: "studio_a",
      txt_HONEY_WALL: "phrases",
      txt_CLEAR_AFTER_A_REVIVE: "phrases",
      txt_INK_TANGLED: "phrases",
      background_preview_bg_03: "studio_a",
      txt_REWARDED_VIDEO: "phrases",
      txt_SABLE_DEFAULT: "phrases",
      txt_ONE_LITTLE_TIP: "phrases",
      txt_DANGER_PIN: "phrases",
      txt_MINT_RAIL: "phrases",
      txt_FEST_NIB: "phrases",
      txt_A_LITTLE_INK_A_CLEVER_SHOT: "phrases",
      txt_PERFECT_PLANNING: "phrases",
      txt_VIDEO_UNAVAILABLE: "phrases",
      txt_FINAL_NIB: "phrases",
      txt_SUN_NIB: "phrases",
      txt_GLOSS_SABLE: "phrases",
      txt_COMB_NIB: "phrases",
      txt_BASE_REWARD_SAVED: "phrases",
      txt_STEADY_THE_PIN: "phrases",
      txt_LEVEL_COMPLETE: "phrases",
      txt_LAMP_NIB: "phrases",
      background_preview_bg_08: "studio_b",
      txt_BERRY_WALL: "phrases",
      txt_TAKE_YOUR_TIME: "phrases",
      background_preview_bg_09: "studio_b",
      txt_PATIO_NIB: "phrases",
      txt_DOUBLE_REWARD_COLLECTED: "phrases",
      txt_COULD_NOT_SAVE: "phrases",
      txt_TUTORIAL: "phrases",
      txt_A_LITTLE_SPARK: "phrases",
      txt_SETTINGS_SOUND: "phrases",
      txt_PAUSED: "phrases",
      txt_BACKGROUNDS: "phrases",
      background_bg_09: "studio_b",
      txt_BLOT_SABLE: "phrases",
      txt_GRAPE_WALL: "phrases",
      txt_STUDIO_MORNING: "phrases",
      txt_MUSIC_VOLUME: "phrases",
      background_bg_08: "studio_b",
      txt_JELLY_NIB: "phrases",
      txt_HEROES: "phrases",
      txt_SETTINGS_GENERAL: "phrases"
    };
    cc._RF.pop();
  }, {} ],
  Art: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "5d226BqkXxAuZzFbKK33v6r", "Art");
    "use strict";
    var frames = {}, _font = null, bundleMap = require("ArtBundles"), loading = {};
    function remember(list) {
      list.forEach(function(a) {
        a instanceof cc.SpriteFrame ? frames[a.name] = a : a instanceof cc.BitmapFont && (_font = a);
      });
    }
    function lazy(node, id, cover) {
      var name = bundleMap[id];
      if (!name) return;
      var key = name + ":" + id;
      loading[key] || (loading[key] = new Promise(function(resolve) {
        cc.assetManager.loadBundle(name, function(err, b) {
          if (err) {
            resolve(false);
            return;
          }
          b.load(id, cc.SpriteFrame, function(e, f) {
            e || (frames[id] = f);
            resolve(!e);
          });
        });
      }));
      loading[key].then(function(ok) {
        ok && cc.isValid(node) ? paint(node, id, cover) : ok || delete loading[key];
      });
    }
    var buttons = {
      "Pull pin": "pull_pin",
      Heroes: "heroes",
      Backgrounds: "backgrounds",
      PLAY: "play",
      Play: "play",
      Home: "home",
      Retry: "retry",
      Restart: "retry",
      Resume: "resume",
      Close: "close",
      "Watch ad x2": "double",
      "Watch ad \xb7 Revive": "revive",
      "Watch Ad to Try": "try",
      "Watch ad \xb7 Claim": "claim",
      "Watch ad \xb7 Help": "help",
      "No Thanks": "decline",
      "No thanks \xb7 Next": "next",
      Finish: "continue",
      Buy: "buy",
      Equip: "equip",
      Equipped: "equipped",
      Locked: "locked",
      "Got it": "gotit",
      Replay: "replay",
      "How to Play": "howto",
      "Sound >": "sound",
      "< General": "general",
      "Continue for free": "continue",
      "Steady pin": "help"
    };
    var icons = {
      Settings: "settings",
      Gift: "gift",
      Skins: "skins",
      Map: "map",
      Shortcut: "shortcut",
      Revisit: "revisit",
      PrevChapter: "left",
      CollectionPrev: "left",
      NextChapter: "right",
      CollectionNext: "right",
      Pause: "pause"
    };
    function paint(node, id, cover) {
      /^bg_/.test(id) ? id = "background_" + id : /^preview_bg_/.test(id) && (id = "background_" + id);
      var f = frames[id];
      if (!f) {
        lazy(node, id, cover);
        return false;
      }
      var child = node.getChildByName("Artwork");
      if (!child) {
        child = new cc.Node("Artwork");
        child.parent = node;
      }
      child.setSiblingIndex(0);
      node._labelToHide && (node._labelToHide.enabled = false);
      var sp = child.getComponent(cc.Sprite) || child.addComponent(cc.Sprite);
      sp.spriteFrame = f;
      sp.sizeMode = cc.Sprite.SizeMode.RAW;
      var r = f.getOriginalSize(), scale = (cover ? Math.max : Math.min)(node.width / r.width, node.height / r.height);
      child.setScale("stretch" === cover ? node.width / r.width : scale, "stretch" === cover ? node.height / r.height : scale);
      if ("stretch" === cover) {
        sp.type = cc.Sprite.Type.SLICED;
        sp.sizeMode = cc.Sprite.SizeMode.CUSTOM;
        f.insetLeft = r.width * ("panel" === id ? .1 : .22);
        f.insetRight = r.width * ("panel" === id ? .1 : .22);
        f.insetTop = r.height * ("panel" === id ? .14 : .22);
        f.insetBottom = r.height * ("panel" === id ? .1 : .22);
        var unit = Math.min(1, node.width / r.width, node.height / r.height);
        child.setScale(unit);
        child.setContentSize(node.width / unit, node.height / unit);
      }
      var g = node.getComponent(cc.Graphics);
      g && (g.enabled = false);
      return true;
    }
    module.exports = {
      phrase: function phrase(text) {
        var key = "txt_" + String(text).toUpperCase().replace(/[^A-Z0-9]+/g, "_").replace(/^_|_$/g, "");
        return frames[key] || bundleMap[key] ? key : null;
      },
      box: function box(name, color) {
        if ("DialogPanel" === name) return "panel";
        if ("Sparks" === name || "Nibs" === name || "Progress" === name || "Toast" === name) return "capsule";
        if (0 === name.indexOf("Card:")) return "capsule";
        if (0 === name.indexOf("Column")) return "column";
        if (0 === name.indexOf("Block:") || "NextShot" === name || "FlyingInk" === name) return "#EFADB7" === color ? "tile_pink" : "#F0C46A" === color ? "tile_gold" : "#C2ACE0" === color ? "tile_lilac" : "tile_mint";
        return null;
      },
      load: function load(done, progress) {
        cc.resources.loadDir("art", progress, function(err, list) {
          err || remember(list);
          done(err);
        });
      },
      paint: paint,
      has: function has(id) {
        return !!frames[id];
      },
      font: function font() {
        return _font;
      },
      button: function button(name, text) {
        if ("LoosePin" === name) return "Safe pin" === text ? "pin" : "btn_danger_pin";
        return icons[name] ? "icon_" + icons[name] : buttons[text] ? "btn_" + buttons[text] : null;
      }
    };
    cc._RF.pop();
  }, {
    ArtBundles: "ArtBundles"
  } ],
  ButtonTouch: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "09e09YXIMZLJY8B/SZ1thHx", "ButtonTouch");
    "use strict";
    module.exports = cc.Class({
      extends: cc.Component,
      init: function init(game, fn) {
        this.game = game;
        this.fn = fn;
        this.finger = null;
        this.inside = false;
        this.button = this.node.getComponent(cc.Button);
        this.node.on(cc.Node.EventType.TOUCH_START, this.startTouch, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.moveTouch, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.cancelTouch, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.endTouch, this);
      },
      startTouch: function startTouch(e) {
        if (!this.game || !this.button.interactable || null !== this.game.pointer) return;
        if (this.game.audio) {
          this.game.audio.unlock();
          0 !== this.node.name.indexOf("Column") && this.game.audio.playSFX("sfx_ui_click");
        }
        this.finger = e.getID();
        this.inside = true;
        this.game.pointer = this.finger;
        this.game.pointerOwner = this;
        this.epoch = this.game.inputEpoch;
        e.stopPropagation();
      },
      moveTouch: function moveTouch(e) {
        e.getID() === this.finger && (this.inside = this.node.getBoundingBoxToWorld().contains(e.getLocation()));
      },
      cancelTouch: function cancelTouch(e) {
        e.getID() === this.finger && this.cancel();
      },
      endTouch: function endTouch(e) {
        if (e.getID() !== this.finger) return;
        var fire = this.inside && this.epoch === this.game.inputEpoch && this.button.interactable && this.node.getBoundingBoxToWorld().contains(e.getLocation());
        this.cancel();
        e.stopPropagation();
        fire && this.fn.call(this.game);
      },
      cancel: function cancel() {
        if (this.game && this.game.pointerOwner === this) {
          this.game.pointer = null;
          this.game.pointerOwner = null;
        }
        this.finger = null;
        this.inside = false;
      },
      onDisable: function onDisable() {
        this.cancel();
      },
      onEnable: function onEnable() {
        this.cancel();
      },
      onDestroy: function onDestroy() {
        this.cancel();
        this.node.targetOff(this);
      },
      update: function update() {
        null === this.finger || this.button.interactable || this.cancel();
      }
    });
    cc._RF.pop();
  }, {} ],
  DailyCheckin: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "143faN+cZFJMog0YpA/38YJ", "DailyCheckin");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.claimCheckin = exports.checkinStatus = exports.createCheckin = exports.validateCheckin = exports.nextResetAt = exports.localDay = exports.CHECKIN_VERSION = void 0;
    exports.CHECKIN_VERSION = 1;
    var DAY = 864e5;
    var TYPES = [ "coins", "energy", "stars", "item", "skin" ];
    function copy(x) {
      return JSON.parse(JSON.stringify(x));
    }
    function isInt(v) {
      return "number" === typeof v && Math.floor(v) === v;
    }
    function localDay(cfg, nowMs) {
      var d = new Date(nowMs - 36e5 * (cfg.reset_hour || 0));
      return Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / DAY);
    }
    exports.localDay = localDay;
    function nextResetAt(cfg, nowMs) {
      var u = new Date((localDay(cfg, nowMs) + 1) * DAY);
      return new Date(u.getUTCFullYear(), u.getUTCMonth(), u.getUTCDate(), cfg.reset_hour || 0).getTime();
    }
    exports.nextResetAt = nextResetAt;
    function coinsOf(day) {
      return day.rewards.reduce(function(n, r) {
        return n + ("coins" === r.type ? r.amount : 0);
      }, 0);
    }
    function validateCheckin(cfg) {
      var e = [];
      var need = function(ok, msg) {
        ok || e.push(msg);
      };
      if (!cfg || "object" !== typeof cfg) return [ "config must be an object" ];
      need("checkin_config.v1" === cfg.schema, "schema must be checkin_config.v1");
      need("cumulative" === cfg.mode || "consecutive" === cfg.mode, "mode cumulative (missed days do not reset, default) | consecutive");
      need(isInt(cfg.reset_hour || 0) && (cfg.reset_hour || 0) >= 0 && (cfg.reset_hour || 0) <= 23, "reset_hour 0..23");
      need(isInt(cfg.R) && cfg.R > 0, "R = coins of a medium level (same as coins_per_ad in unlock_table.json)");
      var days = cfg.days;
      need(Array.isArray(days) && 7 === days.length, "days: exactly 7");
      if (!Array.isArray(days) || 7 !== days.length) return e;
      days.forEach(function(d, i) {
        need(d && d.day === i + 1 && Array.isArray(d.rewards) && d.rewards.length >= 1, "days[" + i + "]: day " + (i + 1) + " with rewards");
        (d && Array.isArray(d.rewards) ? d.rewards : []).forEach(function(r, k) {
          need(r && TYPES.indexOf(r.type) >= 0, "day " + (i + 1) + " reward " + k + ": type " + TYPES.join("|"));
          r && "skin" === r.type ? need("string" === typeof r.id && r.id && isInt(r.fallback_coins) && r.fallback_coins > 0, "day " + (i + 1) + ": skin reward needs id and fallback_coins (paid when the skin is already owned)") : r && need(isInt(r.amount) && r.amount > 0, "day " + (i + 1) + " reward " + k + ": whole amount > 0");
          r && "item" === r.type && need("string" === typeof r.id && r.id, "day " + (i + 1) + ": item reward needs an id");
        });
      });
      var ok7 = days.every(function(d) {
        return d && Array.isArray(d.rewards);
      });
      if (!ok7) return e;
      var coinDays = days.slice(0, 6).filter(function(d) {
        return coinsOf(d) > 0;
      });
      need(coinDays.length >= 2, "days 1-6: at least two coin days");
      for (var i = 1; i < coinDays.length; i++) need(coinsOf(coinDays[i]) > coinsOf(coinDays[i - 1]), "coin days must grow (day " + coinDays[i].day + ")");
      need(0 === coinDays.length || coinsOf(coinDays[0]) >= cfg.R, "day 1 coins >= R (one medium level)");
      need(days.slice(0, 6).some(function(d) {
        return d.rewards.some(function(r) {
          return "coins" !== r.type;
        });
      }), "days 1-6: at least one non-coin reward (energy/stars/item/skin)");
      var last = days[6];
      need(true === last.big && "string" === typeof last.title && last.title, 'day 7: big: true and a title (e.g. "Mystery Gift"), drawn as the large card');
      need(last.rewards.length >= 3 && new Set(last.rewards.map(function(r) {
        return r.type;
      })).size >= 2, "day 7: a big bundle of >= 3 rewards of >= 2 kinds");
      var before = days.slice(0, 6).reduce(function(n, d) {
        return n + coinsOf(d);
      }, 0);
      need(coinsOf(last) >= 2 * Math.max.apply(Math, days.slice(0, 6).map(coinsOf)) && coinsOf(last) >= .5 * before, "day 7 coins >= 2x the biggest earlier day and >= half of days 1-6 together (the final reward is the big one)");
      var skins = days.reduce(function(a, d) {
        return a.concat(d.rewards.filter(function(r) {
          return "skin" === r.type;
        }).map(function(r) {
          return r.id;
        }));
      }, []);
      need(skins.length >= 1, "at least one check-in skin in the 7 days (user: coins, skins and stars)");
      need(new Set(skins).size === skins.length, "check-in skins are all different");
      need(days.slice(0, 6).every(function(d) {
        return !d.big;
      }), "only day 7 is big");
      return e;
    }
    exports.validateCheckin = validateCheckin;
    function createCheckin(cfg, nowMs) {
      return {
        v: 1,
        claimed: 0,
        cycle: 0,
        last_day: null,
        total: 0,
        created: localDay(cfg, nowMs)
      };
    }
    exports.createCheckin = createCheckin;
    function canClaim(cfg, st, nowMs) {
      return null === st.last_day || localDay(cfg, nowMs) > st.last_day;
    }
    function position(cfg, st, nowMs) {
      var today = localDay(cfg, nowMs);
      if ("consecutive" === cfg.mode && null !== st.last_day && today > st.last_day + 1) return 0;
      return st.claimed;
    }
    function checkinStatus(state, cfg, nowMs) {
      var st = state;
      var can = canClaim(cfg, st, nowMs);
      var pos = can ? position(cfg, st, nowMs) : st.claimed;
      var shownClaimed = can ? pos : 0 === st.claimed && null !== st.last_day ? 7 : st.claimed;
      var days = cfg.days.map(function(d, i) {
        return {
          day: d.day,
          rewards: d.rewards,
          big: !!d.big,
          title: d.title || "",
          state: i < shownClaimed ? "claimed" : can && i === pos ? "today" : "future"
        };
      });
      return {
        can_claim: can,
        today_index: can ? pos : -1,
        days: days,
        progress: shownClaimed + "/7",
        next_at: nextResetAt(cfg, nowMs),
        cycle: st.cycle
      };
    }
    exports.checkinStatus = checkinStatus;
    function claimCheckin(state, cfg, nowMs, owned) {
      var st = copy(state);
      if (!canClaim(cfg, st, nowMs)) return {
        state: st,
        rewards: [],
        claimed_day: 0
      };
      var pos = position(cfg, st, nowMs);
      var have = (owned || []).slice();
      var rewards = cfg.days[pos].rewards.map(function(r) {
        if ("skin" === r.type && have.indexOf(r.id) >= 0) return {
          type: "coins",
          amount: r.fallback_coins,
          instead_of: r.id
        };
        return copy(r);
      });
      st.claimed = pos + 1;
      st.last_day = localDay(cfg, nowMs);
      st.total += 1;
      if (7 === st.claimed) {
        st.claimed = 0;
        st.cycle += 1;
      }
      return {
        state: st,
        rewards: rewards,
        claimed_day: pos + 1,
        big: !!cfg.days[pos].big
      };
    }
    exports.claimCheckin = claimCheckin;
    cc._RF.pop();
  }, {} ],
  Data: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "a05d0Ivo4hMo5GHjJkxgZ1U", "Data");
    "use strict";
    module.exports = {
      levels: {
        schema: "stx-levels.v2",
        seed: 138880088,
        levels: [ {
          id: 1,
          type: "main",
          columns: [ [], [], [], [], [] ],
          queue: [ 1, 1, 1, 1 ],
          goal: 2,
          merge: true,
          pin: false,
          recipe: null,
          echo: false,
          bank_rule: false,
          ink_double: false,
          gold: 2,
          orders: [ null, null ],
          target: 4,
          perfect: {
            kind: "column_switches",
            maxSwitches: 0,
            text: "Switch columns at most 0 times without a revive."
          },
          metrics: {
            shots: 4,
            initial_blocks: 0,
            max_goal: 2,
            ordered_shots: 0
          }
        }, {
          id: 2,
          type: "main",
          columns: [ [], [], [], [], [] ],
          queue: [ 1, 1, 1, 1, 1, 1 ],
          goal: 2,
          merge: true,
          pin: false,
          recipe: null,
          echo: false,
          bank_rule: false,
          ink_double: false,
          gold: 4,
          orders: [ null, null, null ],
          target: 6,
          perfect: {
            kind: "column_switches",
            maxSwitches: 0,
            text: "Switch columns at most 0 times without a revive."
          },
          metrics: {
            shots: 6,
            initial_blocks: 0,
            max_goal: 2,
            ordered_shots: 0
          }
        }, {
          id: 3,
          type: "main",
          columns: [ [], [], [], [], [] ],
          queue: [ 1, 1, 1, 1, 1, 1, 1, 1 ],
          goal: 2,
          merge: true,
          pin: false,
          recipe: null,
          echo: false,
          bank_rule: false,
          ink_double: false,
          gold: 3,
          orders: [ null, null, null, null ],
          target: 8,
          perfect: {
            kind: "column_switches",
            maxSwitches: 0,
            text: "Switch columns at most 0 times without a revive."
          },
          metrics: {
            shots: 8,
            initial_blocks: 0,
            max_goal: 2,
            ordered_shots: 0
          }
        }, {
          id: 4,
          type: "main",
          columns: [ [ 2 ], [ 2 ], [], [], [] ],
          queue: [ 1, 2, 1, 4 ],
          goal: 4,
          merge: true,
          pin: false,
          recipe: null,
          echo: false,
          bank_rule: false,
          ink_double: false,
          gold: 1,
          orders: [ null, null, null, null ],
          target: 12,
          perfect: {
            kind: "column_switches",
            maxSwitches: 2,
            text: "Switch columns at most 2 times without a revive."
          },
          metrics: {
            shots: 4,
            initial_blocks: 2,
            max_goal: 4,
            ordered_shots: 0
          }
        }, {
          id: 5,
          type: "main",
          columns: [ [], [ 2 ], [], [], [ 2 ] ],
          queue: [ 2, 1, 1, 4 ],
          goal: 4,
          merge: true,
          pin: false,
          recipe: null,
          echo: false,
          bank_rule: false,
          ink_double: false,
          gold: 2,
          orders: [ null, null, null, null ],
          target: 12,
          perfect: {
            kind: "column_switches",
            maxSwitches: 1,
            text: "Switch columns at most 1 times without a revive."
          },
          metrics: {
            shots: 4,
            initial_blocks: 2,
            max_goal: 4,
            ordered_shots: 0
          }
        }, {
          id: 6,
          type: "bonus",
          columns: [ [], [], [], [], [ 4 ] ],
          queue: [ 4, 8 ],
          goal: 8,
          merge: true,
          pin: false,
          recipe: null,
          echo: false,
          bank_rule: false,
          ink_double: false,
          gold: 3,
          orders: [ null, null ],
          target: 16,
          perfect: {
            kind: "column_switches",
            maxSwitches: 0,
            text: "Switch columns at most 0 times without a revive."
          },
          metrics: {
            shots: 2,
            initial_blocks: 1,
            max_goal: 8,
            ordered_shots: 0
          }
        }, {
          id: 7,
          type: "main",
          columns: [ [], [], [ 2 ], [ 2, 1 ], [] ],
          queue: [ 2, 1, 4 ],
          goal: 4,
          merge: true,
          pin: false,
          recipe: null,
          echo: false,
          bank_rule: false,
          ink_double: false,
          gold: 0,
          orders: [ null, null, null ],
          target: 12,
          perfect: {
            kind: "column_switches",
            maxSwitches: 1,
            text: "Switch columns at most 1 times without a revive."
          },
          metrics: {
            shots: 3,
            initial_blocks: 3,
            max_goal: 4,
            ordered_shots: 0
          }
        }, {
          id: 8,
          type: "main",
          columns: [ [], [], [], [ 2 ], [ 2 ] ],
          queue: [ 2, 2, 4 ],
          goal: 4,
          merge: true,
          pin: false,
          recipe: null,
          echo: false,
          bank_rule: false,
          ink_double: false,
          gold: 0,
          orders: [ null, null, null ],
          target: 12,
          perfect: {
            kind: "column_switches",
            maxSwitches: 1,
            text: "Switch columns at most 1 times without a revive."
          },
          metrics: {
            shots: 3,
            initial_blocks: 2,
            max_goal: 4,
            ordered_shots: 0
          }
        }, {
          id: 9,
          type: "main",
          columns: [ [ 2 ], [], [ 2 ], [], [] ],
          queue: [ 1, 1, 2, 4 ],
          goal: 4,
          merge: true,
          pin: false,
          recipe: null,
          echo: false,
          bank_rule: false,
          ink_double: false,
          gold: 4,
          orders: [ null, null, null, null ],
          target: 12,
          perfect: {
            kind: "column_switches",
            maxSwitches: 1,
            text: "Switch columns at most 1 times without a revive."
          },
          metrics: {
            shots: 4,
            initial_blocks: 2,
            max_goal: 4,
            ordered_shots: 0
          }
        }, {
          id: 10,
          type: "main",
          columns: [ [], [ 1 ], [ 2 ], [ 2 ], [] ],
          queue: [ 2, 1, 2, 1, 1, 4 ],
          goal: 4,
          merge: true,
          pin: false,
          recipe: null,
          echo: false,
          bank_rule: false,
          ink_double: false,
          gold: 3,
          orders: [ null, null, null, null, null, null ],
          target: 16,
          perfect: {
            kind: "column_switches",
            maxSwitches: 3,
            text: "Switch columns at most 3 times without a revive."
          },
          metrics: {
            shots: 6,
            initial_blocks: 3,
            max_goal: 4,
            ordered_shots: 0
          }
        }, {
          id: 11,
          type: "main",
          columns: [ [], [ 2 ], [ 2, 1 ], [ 2 ], [] ],
          queue: [ 1, 2, 1, 1, 4 ],
          goal: 4,
          merge: true,
          pin: false,
          recipe: null,
          echo: false,
          bank_rule: false,
          ink_double: false,
          gold: 1,
          orders: [ null, null, null, null, null ],
          target: 16,
          perfect: {
            kind: "column_switches",
            maxSwitches: 2,
            text: "Switch columns at most 2 times without a revive."
          },
          metrics: {
            shots: 5,
            initial_blocks: 4,
            max_goal: 4,
            ordered_shots: 0
          }
        }, {
          id: 12,
          type: "main",
          columns: [ [], [ 4 ], [ 4 ], [ 4 ], [] ],
          queue: [ 4, 4, 2, 1, 1, 8 ],
          goal: 8,
          merge: true,
          pin: true,
          recipe: null,
          echo: false,
          bank_rule: false,
          ink_double: false,
          gold: 4,
          orders: [ null, null, null, null, null, null ],
          target: 32,
          perfect: {
            kind: "column_switches",
            maxSwitches: 2,
            text: "Switch columns at most 2 times without a revive."
          },
          metrics: {
            shots: 6,
            initial_blocks: 3,
            max_goal: 8,
            ordered_shots: 0
          }
        }, {
          id: 13,
          type: "bonus",
          columns: [ [ 4, 2 ], [], [], [], [] ],
          queue: [ 2, 8 ],
          goal: 8,
          merge: true,
          pin: false,
          recipe: null,
          echo: false,
          bank_rule: false,
          ink_double: false,
          gold: 4,
          orders: [ null, null ],
          target: 16,
          perfect: {
            kind: "column_switches",
            maxSwitches: 0,
            text: "Switch columns at most 0 times without a revive."
          },
          metrics: {
            shots: 2,
            initial_blocks: 2,
            max_goal: 8,
            ordered_shots: 0
          }
        }, {
          id: 14,
          type: "main",
          columns: [ [], [ 4 ], [ 4 ], [], [ 4 ] ],
          queue: [ 1, 1, 4, 2, 2, 2, 8 ],
          goal: 8,
          merge: true,
          pin: true,
          recipe: null,
          echo: false,
          bank_rule: false,
          ink_double: false,
          gold: 2,
          orders: [ null, null, null, null, null, null, null ],
          target: 32,
          perfect: {
            kind: "column_switches",
            maxSwitches: 3,
            text: "Switch columns at most 3 times without a revive."
          },
          metrics: {
            shots: 7,
            initial_blocks: 3,
            max_goal: 8,
            ordered_shots: 0
          }
        }, {
          id: 15,
          type: "main",
          columns: [ [ 4 ], [], [ 2 ], [], [ 2 ] ],
          queue: [ 2, 4, 2, 1, 2, 1, 4, 8 ],
          goal: 8,
          merge: true,
          pin: true,
          recipe: null,
          echo: false,
          bank_rule: false,
          ink_double: false,
          gold: 4,
          orders: [ null, null, null, null, null, null, null, null ],
          target: 32,
          perfect: {
            kind: "column_switches",
            maxSwitches: 4,
            text: "Switch columns at most 4 times without a revive."
          },
          metrics: {
            shots: 8,
            initial_blocks: 3,
            max_goal: 8,
            ordered_shots: 0
          }
        }, {
          id: 16,
          type: "main",
          columns: [ [ 4 ], [ 2, 1 ], [ 4 ], [], [ 4 ] ],
          queue: [ 4, 4, 2, 1, 2, 4, 8 ],
          goal: 8,
          merge: true,
          pin: true,
          recipe: null,
          echo: false,
          bank_rule: false,
          ink_double: false,
          gold: 0,
          orders: [ null, null, null, null, null, null, null ],
          target: 40,
          perfect: {
            kind: "column_switches",
            maxSwitches: 5,
            text: "Switch columns at most 5 times without a revive."
          },
          metrics: {
            shots: 7,
            initial_blocks: 5,
            max_goal: 8,
            ordered_shots: 0
          }
        }, {
          id: 17,
          type: "main",
          columns: [ [ 4, 2 ], [ 2 ], [ 4, 2, 1 ], [], [ 4 ] ],
          queue: [ 2, 4, 2, 4, 1, 8 ],
          goal: 8,
          merge: true,
          pin: true,
          recipe: null,
          echo: false,
          bank_rule: false,
          ink_double: false,
          gold: 4,
          orders: [ null, null, null, null, null, null ],
          target: 40,
          perfect: {
            kind: "column_switches",
            maxSwitches: 3,
            text: "Switch columns at most 3 times without a revive."
          },
          metrics: {
            shots: 6,
            initial_blocks: 7,
            max_goal: 8,
            ordered_shots: 0
          }
        }, {
          id: 18,
          type: "special",
          columns: [ [ 4 ], [ 2 ], [ 4 ], [ 4 ], [] ],
          queue: [ 4, 4, 2, 4, 2, 2, 8 ],
          goal: 8,
          merge: true,
          pin: true,
          recipe: null,
          echo: false,
          bank_rule: false,
          ink_double: true,
          gold: 2,
          orders: [ null, null, null, null, null, null, null ],
          target: 48,
          perfect: {
            kind: "column_switches",
            maxSwitches: 3,
            text: "Switch columns at most 3 times without a revive."
          },
          metrics: {
            shots: 7,
            initial_blocks: 4,
            max_goal: 8,
            ordered_shots: 0
          }
        }, {
          id: 19,
          type: "main",
          columns: [ [ 4 ], [ 4 ], [ 4 ], [], [ 4 ] ],
          queue: [ 4, 4, 4, 1, 1, 2, 8 ],
          goal: 8,
          merge: true,
          pin: true,
          recipe: null,
          echo: false,
          bank_rule: false,
          ink_double: false,
          gold: 3,
          orders: [ null, null, null, null, null, null, null ],
          target: 40,
          perfect: {
            kind: "column_switches",
            maxSwitches: 3,
            text: "Switch columns at most 3 times without a revive."
          },
          metrics: {
            shots: 7,
            initial_blocks: 4,
            max_goal: 8,
            ordered_shots: 0
          }
        }, {
          id: 20,
          type: "main",
          columns: [ [ 4 ], [ 4, 2 ], [ 4 ], [], [ 4 ] ],
          queue: [ 2, 2, 1, 2, 1, 1, 4, 1, 8 ],
          goal: 8,
          merge: true,
          pin: true,
          recipe: null,
          echo: false,
          bank_rule: false,
          ink_double: false,
          gold: 3,
          orders: [ null, null, null, null, null, null, null, null, null ],
          target: 40,
          perfect: {
            kind: "column_switches",
            maxSwitches: 5,
            text: "Switch columns at most 5 times without a revive."
          },
          metrics: {
            shots: 9,
            initial_blocks: 5,
            max_goal: 8,
            ordered_shots: 0
          }
        }, {
          id: 21,
          type: "main",
          columns: [ [ 2 ], [ 1 ], [], [ 4 ], [ 4 ] ],
          queue: [ 4, 2, 2, 2, 1, 1, 4, 1, 4, 8 ],
          goal: 8,
          merge: true,
          pin: true,
          recipe: null,
          echo: false,
          bank_rule: false,
          ink_double: false,
          gold: 4,
          orders: [ null, null, null, null, null, null, null, null, null, null ],
          target: 40,
          perfect: {
            kind: "column_switches",
            maxSwitches: 4,
            text: "Switch columns at most 4 times without a revive."
          },
          metrics: {
            shots: 10,
            initial_blocks: 4,
            max_goal: 8,
            ordered_shots: 0
          }
        }, {
          id: 22,
          type: "main",
          columns: [ [ 8 ], [ 2 ], [ 8, 4 ], [ 8 ], [ 8 ] ],
          queue: [ 8, 8, 8, 2, 2, 2, 4, 8, 16 ],
          goal: 16,
          merge: true,
          pin: true,
          recipe: null,
          echo: false,
          bank_rule: false,
          ink_double: false,
          gold: 1,
          orders: [ 3, null, null, 1, null, null, 1, null, null ],
          target: 96,
          perfect: {
            kind: "column_switches",
            maxSwitches: 5,
            text: "Switch columns at most 5 times without a revive."
          },
          metrics: {
            shots: 9,
            initial_blocks: 6,
            max_goal: 16,
            ordered_shots: 3
          }
        }, {
          id: 23,
          type: "bonus",
          columns: [ [], [], [ 8, 4, 2 ], [], [] ],
          queue: [ 2, 16 ],
          goal: 16,
          merge: true,
          pin: false,
          recipe: null,
          echo: false,
          bank_rule: false,
          ink_double: false,
          gold: 1,
          orders: [ null, null ],
          target: 32,
          perfect: {
            kind: "column_switches",
            maxSwitches: 0,
            text: "Switch columns at most 0 times without a revive."
          },
          metrics: {
            shots: 2,
            initial_blocks: 3,
            max_goal: 16,
            ordered_shots: 0
          }
        }, {
          id: 24,
          type: "main",
          columns: [ [ 8 ], [ 8 ], [ 8 ], [ 8 ], [ 4 ] ],
          queue: [ 8, 2, 4, 2, 8, 4, 8, 2, 2, 4, 16 ],
          goal: 16,
          merge: true,
          pin: true,
          recipe: null,
          echo: false,
          bank_rule: false,
          ink_double: false,
          gold: 2,
          orders: [ 0, null, null, 2, null, null, 3, null, null, 4, null ],
          target: 96,
          perfect: {
            kind: "column_switches",
            maxSwitches: 7,
            text: "Switch columns at most 7 times without a revive."
          },
          metrics: {
            shots: 11,
            initial_blocks: 5,
            max_goal: 16,
            ordered_shots: 4
          }
        }, {
          id: 25,
          type: "main",
          columns: [ [ 4 ], [ 2, 1 ], [ 8, 4, 2 ], [ 8, 4 ], [ 8 ] ],
          queue: [ 4, 2, 1, 4, 4, 4, 8, 4, 4, 2, 2, 16 ],
          goal: 16,
          merge: true,
          pin: true,
          recipe: null,
          echo: false,
          bank_rule: false,
          ink_double: false,
          gold: 0,
          orders: [ 3, null, null, 4, null, null, 1, null, null, 0, null, null ],
          target: 96,
          perfect: {
            kind: "column_switches",
            maxSwitches: 8,
            text: "Switch columns at most 8 times without a revive."
          },
          metrics: {
            shots: 12,
            initial_blocks: 9,
            max_goal: 16,
            ordered_shots: 4
          }
        }, {
          id: 26,
          type: "main",
          columns: [ [ 8 ], [ 8 ], [ 8 ], [ 8, 1 ], [ 8 ] ],
          queue: [ 8, 1, 8, 4, 1, 2, 4, 2, 2, 1, 2, 2, 2, 16 ],
          goal: 16,
          merge: true,
          pin: true,
          recipe: null,
          echo: false,
          bank_rule: false,
          ink_double: false,
          gold: 3,
          orders: [ 4, null, null, 2, null, null, 0, null, null, 2, null, null, 2, null ],
          target: 96,
          perfect: {
            kind: "column_switches",
            maxSwitches: 8,
            text: "Switch columns at most 8 times without a revive."
          },
          metrics: {
            shots: 14,
            initial_blocks: 6,
            max_goal: 16,
            ordered_shots: 5
          }
        }, {
          id: 27,
          type: "main",
          columns: [ [ 4 ], [ 4 ], [ 8 ], [ 4, 2, 1 ], [ 4 ] ],
          queue: [ 1, 4, 4, 4, 2, 8, 2, 2, 8, 2, 4, 4, 8, 16 ],
          goal: 16,
          merge: true,
          pin: true,
          recipe: null,
          echo: false,
          bank_rule: false,
          ink_double: false,
          gold: 3,
          orders: [ 3, null, null, 4, null, null, 1, null, null, 0, null, null, 0, null ],
          target: 96,
          perfect: {
            kind: "column_switches",
            maxSwitches: 8,
            text: "Switch columns at most 8 times without a revive."
          },
          metrics: {
            shots: 14,
            initial_blocks: 7,
            max_goal: 16,
            ordered_shots: 5
          }
        }, {
          id: 28,
          type: "main",
          columns: [ [ 8 ], [ 8 ], [ 4 ], [ 8, 4 ], [ 8 ] ],
          queue: [ 8, 4, 4, 8, 4, 4, 8, 16 ],
          goal: 16,
          merge: true,
          pin: true,
          recipe: null,
          echo: false,
          bank_rule: false,
          ink_double: false,
          gold: 3,
          orders: [ 1, null, null, 4, null, null, 2, null ],
          target: 96,
          perfect: {
            kind: "column_switches",
            maxSwitches: 6,
            text: "Switch columns at most 6 times without a revive."
          },
          metrics: {
            shots: 8,
            initial_blocks: 6,
            max_goal: 16,
            ordered_shots: 3
          }
        }, {
          id: 29,
          type: "main",
          columns: [ [ 8 ], [ 8, 4 ], [ 4 ], [ 8 ], [ 8 ] ],
          queue: [ 8, 4, 8, 4, 8, 8, 16 ],
          goal: 16,
          merge: true,
          pin: true,
          recipe: null,
          echo: false,
          bank_rule: false,
          ink_double: false,
          gold: 2,
          orders: [ 4, null, null, 2, null, null, null ],
          target: 96,
          perfect: {
            kind: "column_switches",
            maxSwitches: 4,
            text: "Switch columns at most 4 times without a revive."
          },
          metrics: {
            shots: 7,
            initial_blocks: 6,
            max_goal: 16,
            ordered_shots: 2
          }
        }, {
          id: 30,
          type: "main",
          columns: [ [ 4 ], [ 8 ], [ 8 ], [ 2 ], [ 8, 4 ] ],
          queue: [ 2, 4, 4, 8, 8, 8, 4, 8, 16 ],
          goal: 16,
          merge: true,
          pin: true,
          recipe: null,
          echo: false,
          bank_rule: false,
          ink_double: false,
          gold: 0,
          orders: [ 3, null, null, 1, null, null, 3, null, null ],
          target: 96,
          perfect: {
            kind: "column_switches",
            maxSwitches: 6,
            text: "Switch columns at most 6 times without a revive."
          },
          metrics: {
            shots: 9,
            initial_blocks: 6,
            max_goal: 16,
            ordered_shots: 3
          }
        }, {
          id: 31,
          type: "main",
          columns: [ [ 8 ], [ 8, 4 ], [ 8 ], [ 4 ], [ 8 ] ],
          queue: [ 8, 8, 4, 2, 4, 1, 8, 1, 2, 2, 16 ],
          goal: 16,
          merge: true,
          pin: true,
          recipe: null,
          echo: false,
          bank_rule: false,
          ink_double: false,
          gold: 4,
          orders: [ 2, null, null, 4, null, null, 3, null, null, 4, null ],
          target: 96,
          perfect: {
            kind: "column_switches",
            maxSwitches: 7,
            text: "Switch columns at most 7 times without a revive."
          },
          metrics: {
            shots: 11,
            initial_blocks: 6,
            max_goal: 16,
            ordered_shots: 4
          }
        }, {
          id: 32,
          type: "main",
          columns: [ [ 4, 2 ], [ 8, 1 ], [ 2 ], [ 8, 1 ], [ 8 ] ],
          queue: [ 2, 1, 1, 2, 2, 4, 8, 8, 8, 2, 1, 2, 1, 4, 16 ],
          goal: 16,
          merge: true,
          pin: true,
          recipe: null,
          echo: false,
          bank_rule: false,
          ink_double: false,
          gold: 1,
          orders: [ 2, null, null, 3, null, null, 4, null, null, 3, null, null, 3, null, null ],
          target: 96,
          perfect: {
            kind: "column_switches",
            maxSwitches: 12,
            text: "Switch columns at most 12 times without a revive."
          },
          metrics: {
            shots: 15,
            initial_blocks: 8,
            max_goal: 16,
            ordered_shots: 5
          }
        }, {
          id: 33,
          type: "sealed",
          columns: [ [ 8 ], [ 8 ], [ 8 ], [ 4 ], [ 8 ] ],
          queue: [ 4, 2, 8, 4, 1, 4, 1, 1, 8, 1, 2, 4, 2, 2, 16 ],
          goal: 16,
          merge: true,
          pin: true,
          recipe: null,
          echo: false,
          bank_rule: false,
          ink_double: false,
          gold: 3,
          orders: [ 1, null, null, 2, null, null, 3, null, null, 1, null, null, 3, null, null ],
          target: 96,
          perfect: {
            kind: "column_switches",
            maxSwitches: 8,
            text: "Switch columns at most 8 times without a revive."
          },
          metrics: {
            shots: 15,
            initial_blocks: 5,
            max_goal: 16,
            ordered_shots: 5
          }
        }, {
          id: 34,
          type: "bonus",
          columns: [ [], [], [ 16, 8, 4, 2 ], [], [] ],
          queue: [ 2, 32 ],
          goal: 32,
          merge: true,
          pin: false,
          recipe: null,
          echo: false,
          bank_rule: false,
          ink_double: false,
          gold: 1,
          orders: [ null, null ],
          target: 64,
          perfect: {
            kind: "column_switches",
            maxSwitches: 0,
            text: "Switch columns at most 0 times without a revive."
          },
          metrics: {
            shots: 2,
            initial_blocks: 4,
            max_goal: 32,
            ordered_shots: 0
          }
        }, {
          id: 35,
          type: "main",
          columns: [ [ 4 ], [ 8 ], [ 8 ], [ 2 ], [ 4, 2 ] ],
          queue: [ 2, 1, 2, 2, 1, 8, 1, 4, 1, 2, 2, 4, 4, 2, 4, 4, 1, 1, 2, 4, 16 ],
          goal: 16,
          merge: true,
          pin: true,
          recipe: null,
          echo: false,
          bank_rule: false,
          ink_double: false,
          gold: 0,
          orders: [ 4, null, null, 1, null, null, 1, null, null, 3, null, null, 0, null, null, 3, null, null, 0, null, null ],
          target: 96,
          perfect: {
            kind: "column_switches",
            maxSwitches: 13,
            text: "Switch columns at most 13 times without a revive."
          },
          metrics: {
            shots: 21,
            initial_blocks: 6,
            max_goal: 16,
            ordered_shots: 7
          }
        }, {
          id: 36,
          type: "main",
          columns: [ [ 8 ], [ 16 ], [ 8 ], [ 16, 2 ], [ 16 ] ],
          queue: [ 16, 4, 4, 16, 16, 8, 8, 4, 2, 2, 2, 2, 2, 4, 4, 32 ],
          goal: 32,
          merge: true,
          pin: true,
          recipe: null,
          echo: true,
          bank_rule: false,
          ink_double: false,
          gold: 4,
          orders: [ 4, null, null, 2, null, null, 0, null, null, 0, null, null, 3, null, null, null ],
          target: 237,
          perfect: {
            kind: "column_switches",
            maxSwitches: 4,
            text: "Switch columns at most 4 times without a revive."
          },
          metrics: {
            shots: 16,
            initial_blocks: 6,
            max_goal: 32,
            ordered_shots: 5
          }
        }, {
          id: 37,
          type: "main",
          columns: [ [ 8 ], [ 16 ], [ 16 ], [ 4 ], [ 8 ] ],
          queue: [ 16, 4, 8, 4, 4, 4, 4, 8, 4, 2, 16, 2, 8, 8, 4, 4, 8, 32 ],
          goal: 32,
          merge: true,
          pin: true,
          recipe: null,
          echo: true,
          bank_rule: false,
          ink_double: false,
          gold: 2,
          orders: [ 1, null, null, 3, null, null, 4, null, null, 4, null, null, 4, null, null, 0, null, null ],
          target: 237,
          perfect: {
            kind: "column_switches",
            maxSwitches: 10,
            text: "Switch columns at most 10 times without a revive."
          },
          metrics: {
            shots: 18,
            initial_blocks: 5,
            max_goal: 32,
            ordered_shots: 6
          }
        }, {
          id: 38,
          type: "main",
          columns: [ [ 8 ], [ 8 ], [ 16 ], [ 16, 8 ], [ 16 ] ],
          queue: [ 4, 8, 16, 4, 8, 8, 8, 4, 2, 4, 2, 4, 16, 32 ],
          goal: 32,
          merge: true,
          pin: true,
          recipe: null,
          echo: true,
          bank_rule: false,
          ink_double: false,
          gold: 3,
          orders: [ 3, null, null, 3, null, null, 4, null, null, 4, null, null, 0, null ],
          target: 237,
          perfect: {
            kind: "column_switches",
            maxSwitches: 8,
            text: "Switch columns at most 8 times without a revive."
          },
          metrics: {
            shots: 14,
            initial_blocks: 6,
            max_goal: 32,
            ordered_shots: 5
          }
        }, {
          id: 39,
          type: "main",
          columns: [ [ 16, 4 ], [ 16 ], [ 8 ], [ 8 ], [ 4 ] ],
          queue: [ 4, 16, 8, 8, 8, 8, 4, 16, 8, 4, 4, 16, 32 ],
          goal: 32,
          merge: true,
          pin: true,
          recipe: null,
          echo: true,
          bank_rule: false,
          ink_double: false,
          gold: 3,
          orders: [ 0, null, null, 3, null, null, 4, null, null, 4, null, null, null ],
          target: 237,
          perfect: {
            kind: "column_switches",
            maxSwitches: 7,
            text: "Switch columns at most 7 times without a revive."
          },
          metrics: {
            shots: 13,
            initial_blocks: 6,
            max_goal: 32,
            ordered_shots: 4
          }
        }, {
          id: 40,
          type: "main",
          columns: [ [ 8 ], [ 16 ], [ 16 ], [ 16 ], [ 16 ] ],
          queue: [ 16, 16, 16, 8, 8, 16, 8, 32 ],
          goal: 32,
          merge: true,
          pin: true,
          recipe: null,
          echo: true,
          bank_rule: false,
          ink_double: false,
          gold: 1,
          orders: [ 2, null, null, 0, null, null, 1, null ],
          target: 237,
          perfect: {
            kind: "column_switches",
            maxSwitches: 6,
            text: "Switch columns at most 6 times without a revive."
          },
          metrics: {
            shots: 8,
            initial_blocks: 5,
            max_goal: 32,
            ordered_shots: 3
          }
        }, {
          id: 41,
          type: "main",
          columns: [ [ 16 ], [ 16, 2 ], [ 16 ], [ 8, 2 ], [ 16 ] ],
          queue: [ 2, 4, 2, 2, 1, 2, 4, 2, 1, 4, 8, 8, 8, 4, 4, 4, 16, 4, 2, 2, 32 ],
          goal: 32,
          merge: true,
          pin: true,
          recipe: null,
          echo: true,
          bank_rule: false,
          ink_double: false,
          gold: 2,
          orders: [ 1, null, null, 1, null, null, 3, null, null, 2, null, null, 3, null, null, 4, null, null, 2, null, null ],
          target: 237,
          perfect: {
            kind: "column_switches",
            maxSwitches: 15,
            text: "Switch columns at most 15 times without a revive."
          },
          metrics: {
            shots: 21,
            initial_blocks: 7,
            max_goal: 32,
            ordered_shots: 7
          }
        }, {
          id: 42,
          type: "bonus",
          columns: [ [], [], [], [ 32, 16, 8, 4, 2 ], [] ],
          queue: [ 2, 64 ],
          goal: 64,
          merge: true,
          pin: false,
          recipe: null,
          echo: false,
          bank_rule: false,
          ink_double: false,
          gold: 2,
          orders: [ null, null ],
          target: 128,
          perfect: {
            kind: "column_switches",
            maxSwitches: 0,
            text: "Switch columns at most 0 times without a revive."
          },
          metrics: {
            shots: 2,
            initial_blocks: 5,
            max_goal: 64,
            ordered_shots: 0
          }
        }, {
          id: 43,
          type: "main",
          columns: [ [ 16 ], [ 16, 8 ], [ 2 ], [ 16 ], [ 16 ] ],
          queue: [ 8, 16, 16, 2, 16, 4, 8, 8, 8, 32 ],
          goal: 32,
          merge: true,
          pin: true,
          recipe: null,
          echo: true,
          bank_rule: false,
          ink_double: false,
          gold: 1,
          orders: [ 1, null, null, 2, null, null, 2, null, null, null ],
          target: 237,
          perfect: {
            kind: "column_switches",
            maxSwitches: 5,
            text: "Switch columns at most 5 times without a revive."
          },
          metrics: {
            shots: 10,
            initial_blocks: 6,
            max_goal: 32,
            ordered_shots: 3
          }
        }, {
          id: 44,
          type: "main",
          columns: [ [ 16 ], [ 16 ], [ 4 ], [ 16 ], [ 8 ] ],
          queue: [ 8, 1, 1, 2, 16, 8, 16, 8, 8, 8, 8, 16, 32 ],
          goal: 32,
          merge: true,
          pin: true,
          recipe: null,
          echo: true,
          bank_rule: false,
          ink_double: false,
          gold: 1,
          orders: [ 4, null, null, 2, null, null, 3, null, null, 0, null, null, null ],
          target: 237,
          perfect: {
            kind: "column_switches",
            maxSwitches: 7,
            text: "Switch columns at most 7 times without a revive."
          },
          metrics: {
            shots: 13,
            initial_blocks: 5,
            max_goal: 32,
            ordered_shots: 4
          }
        }, {
          id: 45,
          type: "main",
          columns: [ [ 4 ], [ 16, 8 ], [ 16, 8 ], [ 16, 8, 4, 2 ], [ 16 ] ],
          queue: [ 8, 2, 2, 8, 2, 8, 16, 16, 32 ],
          goal: 32,
          merge: true,
          pin: true,
          recipe: null,
          echo: true,
          bank_rule: false,
          ink_double: false,
          gold: 1,
          orders: [ 1, null, null, 2, null, null, 4, null, null ],
          target: 237,
          perfect: {
            kind: "column_switches",
            maxSwitches: 6,
            text: "Switch columns at most 6 times without a revive."
          },
          metrics: {
            shots: 9,
            initial_blocks: 10,
            max_goal: 32,
            ordered_shots: 3
          }
        }, {
          id: 46,
          type: "main",
          columns: [ [ 16 ], [ 16 ], [ 16 ], [ 16 ], [ 16, 8 ] ],
          queue: [ 16, 4, 4, 8, 16, 8, 8, 8, 32 ],
          goal: 32,
          merge: true,
          pin: true,
          recipe: null,
          echo: true,
          bank_rule: false,
          ink_double: false,
          gold: 0,
          orders: [ 2, null, null, 0, null, null, 3, null, null ],
          target: 237,
          perfect: {
            kind: "column_switches",
            maxSwitches: 5,
            text: "Switch columns at most 5 times without a revive."
          },
          metrics: {
            shots: 9,
            initial_blocks: 6,
            max_goal: 32,
            ordered_shots: 3
          }
        }, {
          id: 47,
          type: "main",
          columns: [ [ 16 ], [ 16 ], [ 16 ], [ 16, 8, 4 ], [ 16 ] ],
          queue: [ 16, 4, 16, 16, 4, 2, 2, 4, 4, 32 ],
          goal: 32,
          merge: true,
          pin: true,
          recipe: null,
          echo: true,
          bank_rule: false,
          ink_double: false,
          gold: 3,
          orders: [ 4, null, null, 2, null, null, 1, null, null, null ],
          target: 237,
          perfect: {
            kind: "column_switches",
            maxSwitches: 4,
            text: "Switch columns at most 4 times without a revive."
          },
          metrics: {
            shots: 10,
            initial_blocks: 7,
            max_goal: 32,
            ordered_shots: 3
          }
        }, {
          id: 48,
          type: "main",
          columns: [ [ 8 ], [ 8, 4 ], [ 8 ], [ 4 ], [ 4 ] ],
          queue: [ 8, 4, 4, 8, 4, 4, 4, 4, 2, 2, 1, 1, 16 ],
          goal: 16,
          merge: true,
          pin: true,
          recipe: null,
          echo: true,
          bank_rule: true,
          ink_double: false,
          gold: 1,
          orders: [ 2, null, null, 4, null, null, 3, null, null, 0, null, null, null ],
          target: 157,
          perfect: {
            kind: "column_switches",
            maxSwitches: 6,
            text: "Switch columns at most 6 times without a revive."
          },
          metrics: {
            shots: 13,
            initial_blocks: 6,
            max_goal: 16,
            ordered_shots: 4
          }
        }, {
          id: 49,
          type: "main",
          columns: [ [ 4 ], [ 8 ], [ 4 ], [ 2 ], [ 4 ] ],
          queue: [ 4, 2, 4, 2, 4, 2, 4, 4, 2, 2, 2, 2, 2, 4, 8, 2, 4, 4, 1, 1, 16 ],
          goal: 16,
          merge: true,
          pin: true,
          recipe: null,
          echo: true,
          bank_rule: true,
          ink_double: false,
          gold: 0,
          orders: [ 2, null, null, 3, null, null, 2, null, null, 4, null, null, 1, null, null, 1, null, null, 4, null, null ],
          target: 177,
          perfect: {
            kind: "column_switches",
            maxSwitches: 14,
            text: "Switch columns at most 14 times without a revive."
          },
          metrics: {
            shots: 21,
            initial_blocks: 5,
            max_goal: 16,
            ordered_shots: 7
          }
        }, {
          id: 50,
          type: "main",
          columns: [ [ 8 ], [ 8 ], [ 8 ], [ 8, 2 ], [ 4 ] ],
          queue: [ 2, 4, 2, 1, 8, 8, 1, 4, 4, 4, 4, 1, 1, 16 ],
          goal: 16,
          merge: true,
          pin: true,
          recipe: null,
          echo: true,
          bank_rule: true,
          ink_double: false,
          gold: 1,
          orders: [ 3, null, null, 1, null, null, 1, null, null, 4, null, null, 2, null ],
          target: 157,
          perfect: {
            kind: "column_switches",
            maxSwitches: 8,
            text: "Switch columns at most 8 times without a revive."
          },
          metrics: {
            shots: 14,
            initial_blocks: 6,
            max_goal: 16,
            ordered_shots: 5
          }
        }, {
          id: 51,
          type: "main",
          columns: [ [ 8 ], [ 8 ], [ 2 ], [ 8, 4 ], [ 8 ] ],
          queue: [ 1, 8, 4, 2, 1, 8, 1, 1, 2, 4, 2, 8, 1, 1, 16 ],
          goal: 16,
          merge: true,
          pin: true,
          recipe: null,
          echo: true,
          bank_rule: true,
          ink_double: false,
          gold: 1,
          orders: [ 2, null, null, 4, null, null, 4, null, null, 3, null, null, 4, null, null ],
          target: 153,
          perfect: {
            kind: "column_switches",
            maxSwitches: 9,
            text: "Switch columns at most 9 times without a revive."
          },
          metrics: {
            shots: 15,
            initial_blocks: 6,
            max_goal: 16,
            ordered_shots: 5
          }
        }, {
          id: 52,
          type: "main",
          columns: [ [ 8, 4 ], [ 4, 2 ], [ 8 ], [ 4 ], [ 8 ] ],
          queue: [ 4, 8, 4, 2, 4, 4, 2, 2, 8, 4, 1, 1, 16 ],
          goal: 16,
          merge: true,
          pin: true,
          recipe: null,
          echo: true,
          bank_rule: true,
          ink_double: false,
          gold: 2,
          orders: [ 2, null, null, 1, null, null, 2, null, null, 1, null, null, null ],
          target: 157,
          perfect: {
            kind: "column_switches",
            maxSwitches: 8,
            text: "Switch columns at most 8 times without a revive."
          },
          metrics: {
            shots: 13,
            initial_blocks: 7,
            max_goal: 16,
            ordered_shots: 4
          }
        }, {
          id: 53,
          type: "main",
          columns: [ [ 8 ], [ 4 ], [ 8, 4 ], [ 8 ], [ 8 ] ],
          queue: [ 8, 8, 4, 8, 4, 8, 1, 1, 16 ],
          goal: 16,
          merge: true,
          pin: true,
          recipe: null,
          echo: true,
          bank_rule: true,
          ink_double: false,
          gold: 2,
          orders: [ 4, null, null, 1, null, null, 2, null, null ],
          target: 149,
          perfect: {
            kind: "column_switches",
            maxSwitches: 5,
            text: "Switch columns at most 5 times without a revive."
          },
          metrics: {
            shots: 9,
            initial_blocks: 6,
            max_goal: 16,
            ordered_shots: 3
          }
        }, {
          id: 54,
          type: "bonus",
          columns: [ [], [ 64, 32, 16, 8, 4 ], [ 64 ], [], [] ],
          queue: [ 4, 64, 128 ],
          goal: 128,
          merge: true,
          pin: false,
          recipe: null,
          echo: false,
          bank_rule: false,
          ink_double: false,
          gold: 0,
          orders: [ null, null, null ],
          target: 384,
          perfect: {
            kind: "column_switches",
            maxSwitches: 1,
            text: "Switch columns at most 1 times without a revive."
          },
          metrics: {
            shots: 3,
            initial_blocks: 6,
            max_goal: 128,
            ordered_shots: 0
          }
        }, {
          id: 55,
          type: "main",
          columns: [ [ 8 ], [ 4 ], [ 4 ], [ 2 ], [ 8, 2 ] ],
          queue: [ 2, 8, 2, 2, 1, 2, 4, 2, 1, 4, 8, 2, 2, 2, 2, 4, 4, 1, 1, 16 ],
          goal: 16,
          merge: true,
          pin: true,
          recipe: null,
          echo: true,
          bank_rule: true,
          ink_double: false,
          gold: 4,
          orders: [ 3, null, null, 4, null, null, 4, null, null, 3, null, null, 2, null, null, 2, null, null, 2, null ],
          target: 173,
          perfect: {
            kind: "column_switches",
            maxSwitches: 14,
            text: "Switch columns at most 14 times without a revive."
          },
          metrics: {
            shots: 20,
            initial_blocks: 6,
            max_goal: 16,
            ordered_shots: 7
          }
        }, {
          id: 56,
          type: "main",
          columns: [ [ 2 ], [ 8 ], [ 8 ], [ 16 ], [ 16 ] ],
          queue: [ 2, 8, 16, 16, 16, 8, 8, 8, 4, 8, 16, 1, 1, 32 ],
          goal: 32,
          merge: true,
          pin: true,
          recipe: null,
          echo: true,
          bank_rule: true,
          ink_double: false,
          gold: 2,
          orders: [ 0, null, null, 1, null, null, 2, null, null, 0, null, null, 1, null ],
          target: 297,
          perfect: {
            kind: "column_switches",
            maxSwitches: 7,
            text: "Switch columns at most 7 times without a revive."
          },
          metrics: {
            shots: 14,
            initial_blocks: 5,
            max_goal: 32,
            ordered_shots: 5
          }
        }, {
          id: 57,
          type: "main",
          columns: [ [ 4 ], [ 8 ], [ 16 ], [ 8, 4 ], [ 16 ] ],
          queue: [ 8, 4, 4, 4, 8, 8, 4, 8, 8, 8, 8, 16, 8, 8, 1, 1, 32 ],
          goal: 32,
          merge: true,
          pin: true,
          recipe: null,
          echo: true,
          bank_rule: true,
          ink_double: false,
          gold: 0,
          orders: [ 4, null, null, 1, null, null, 1, null, null, 0, null, null, 0, null, null, 4, null ],
          target: 293,
          perfect: {
            kind: "column_switches",
            maxSwitches: 12,
            text: "Switch columns at most 12 times without a revive."
          },
          metrics: {
            shots: 17,
            initial_blocks: 6,
            max_goal: 32,
            ordered_shots: 6
          }
        }, {
          id: 58,
          type: "main",
          columns: [ [ 16, 8 ], [ 16 ], [ 8, 2, 1 ], [ 16 ], [ 16 ] ],
          queue: [ 8, 8, 8, 1, 2, 16, 2, 16, 16, 1, 1, 32 ],
          goal: 32,
          merge: true,
          pin: true,
          recipe: null,
          echo: true,
          bank_rule: true,
          ink_double: false,
          gold: 2,
          orders: [ 0, null, null, 2, null, null, 2, null, null, 4, null, null ],
          target: 257,
          perfect: {
            kind: "column_switches",
            maxSwitches: 6,
            text: "Switch columns at most 6 times without a revive."
          },
          metrics: {
            shots: 12,
            initial_blocks: 8,
            max_goal: 32,
            ordered_shots: 4
          }
        }, {
          id: 59,
          type: "main",
          columns: [ [ 16 ], [ 16 ], [ 16 ], [ 16, 8 ], [ 16, 8 ] ],
          queue: [ 16, 8, 8, 16, 4, 4, 8, 1, 1, 32 ],
          goal: 32,
          merge: true,
          pin: true,
          recipe: null,
          echo: true,
          bank_rule: true,
          ink_double: false,
          gold: 3,
          orders: [ 0, null, null, 2, null, null, 4, null, null, null ],
          target: 237,
          perfect: {
            kind: "column_switches",
            maxSwitches: 6,
            text: "Switch columns at most 6 times without a revive."
          },
          metrics: {
            shots: 10,
            initial_blocks: 7,
            max_goal: 32,
            ordered_shots: 3
          }
        }, {
          id: 60,
          type: "main",
          columns: [ [ 8 ], [ 8 ], [ 8, 2, 1 ], [ 16, 8, 4 ], [ 16 ] ],
          queue: [ 4, 8, 16, 4, 16, 4, 8, 8, 1, 4, 8, 8, 1, 1, 32 ],
          goal: 32,
          merge: true,
          pin: true,
          recipe: null,
          echo: true,
          bank_rule: true,
          ink_double: false,
          gold: 0,
          orders: [ 0, null, null, 3, null, null, 0, null, null, 2, null, null, 3, null, null ],
          target: 289,
          perfect: {
            kind: "column_switches",
            maxSwitches: 7,
            text: "Switch columns at most 7 times without a revive."
          },
          metrics: {
            shots: 15,
            initial_blocks: 9,
            max_goal: 32,
            ordered_shots: 5
          }
        }, {
          id: 61,
          type: "main",
          columns: [ [ 16 ], [ 16 ], [ 16 ], [ 8 ], [ 8, 4 ] ],
          queue: [ 8, 16, 16, 4, 16, 4, 4, 8, 8, 8, 1, 1, 32 ],
          goal: 32,
          merge: true,
          pin: true,
          recipe: null,
          echo: true,
          bank_rule: true,
          ink_double: false,
          gold: 4,
          orders: [ 3, null, null, 4, null, null, 0, null, null, 4, null, null, null ],
          target: 277,
          perfect: {
            kind: "column_switches",
            maxSwitches: 7,
            text: "Switch columns at most 7 times without a revive."
          },
          metrics: {
            shots: 13,
            initial_blocks: 6,
            max_goal: 32,
            ordered_shots: 4
          }
        }, {
          id: 62,
          type: "main",
          columns: [ [ 8 ], [ 16 ], [ 16, 8 ], [ 16, 8, 4 ], [ 16 ] ],
          queue: [ 8, 8, 8, 8, 16, 2, 1, 8, 4, 1, 4, 1, 1, 32 ],
          goal: 32,
          merge: true,
          pin: true,
          recipe: null,
          echo: true,
          bank_rule: true,
          ink_double: false,
          gold: 0,
          orders: [ 0, null, null, 0, null, null, 0, null, null, 0, null, null, 0, null ],
          target: 257,
          perfect: {
            kind: "column_switches",
            maxSwitches: 8,
            text: "Switch columns at most 8 times without a revive."
          },
          metrics: {
            shots: 14,
            initial_blocks: 8,
            max_goal: 32,
            ordered_shots: 5
          }
        }, {
          id: 63,
          type: "main",
          columns: [ [ 16, 8, 4 ], [ 2 ], [ 16 ], [ 16 ], [ 4 ] ],
          queue: [ 4, 2, 16, 4, 4, 8, 4, 4, 8, 8, 8, 8, 8, 8, 1, 1, 32 ],
          goal: 32,
          merge: true,
          pin: true,
          recipe: null,
          echo: true,
          bank_rule: true,
          ink_double: false,
          gold: 1,
          orders: [ 0, null, null, 1, null, null, 1, null, null, 3, null, null, 4, null, null, 3, null ],
          target: 289,
          perfect: {
            kind: "column_switches",
            maxSwitches: 10,
            text: "Switch columns at most 10 times without a revive."
          },
          metrics: {
            shots: 17,
            initial_blocks: 7,
            max_goal: 32,
            ordered_shots: 6
          }
        }, {
          id: 64,
          type: "bonus",
          columns: [ [ 128, 64, 32, 16, 8 ], [ 128, 64 ], [], [], [] ],
          queue: [ 8, 64, 256 ],
          goal: 256,
          merge: true,
          pin: false,
          recipe: null,
          echo: false,
          bank_rule: false,
          ink_double: false,
          gold: 4,
          orders: [ null, null, null ],
          target: 768,
          perfect: {
            kind: "column_switches",
            maxSwitches: 1,
            text: "Switch columns at most 1 times without a revive."
          },
          metrics: {
            shots: 3,
            initial_blocks: 7,
            max_goal: 256,
            ordered_shots: 0
          }
        }, {
          id: 65,
          type: "main",
          columns: [ [ 32, 16 ], [ 32, 16, 4 ], [ 8 ], [ 16, 8 ], [ 32, 8 ] ],
          queue: [ 16, 4, 2, 8, 8, 2, 4, 8, 4, 16, 16, 8, 4, 16, 8, 8, 16, 1, 1, 64 ],
          goal: 64,
          merge: true,
          pin: true,
          recipe: null,
          echo: true,
          bank_rule: true,
          ink_double: false,
          gold: 0,
          orders: [ 0, null, null, 1, null, null, 2, null, null, 3, null, null, 2, null, null, 2, null, null, 4, null ],
          target: 553,
          perfect: {
            kind: "column_switches",
            maxSwitches: 11,
            text: "Switch columns at most 11 times without a revive."
          },
          metrics: {
            shots: 20,
            initial_blocks: 10,
            max_goal: 64,
            ordered_shots: 7
          }
        }, {
          id: 66,
          type: "main",
          columns: [ [ 32 ], [ 32 ], [ 16 ], [ 32 ], [ 16 ] ],
          queue: [ 16, 32, 32, 32, 16, 2, 2, 16, 4, 4, 8, 2, 4, 2, 4, 16, 1, 1, 64 ],
          goal: 64,
          merge: true,
          pin: true,
          recipe: null,
          echo: true,
          bank_rule: true,
          ink_double: false,
          gold: 4,
          orders: [ 2, null, null, 2, null, null, 0, null, null, 0, null, null, 0, null, null, 4, null, null, null ],
          target: 525,
          perfect: {
            kind: "column_switches",
            maxSwitches: 10,
            text: "Switch columns at most 10 times without a revive."
          },
          metrics: {
            shots: 19,
            initial_blocks: 5,
            max_goal: 64,
            ordered_shots: 6
          }
        }, {
          id: 67,
          type: "main",
          columns: [ [ 16 ], [ 16 ], [ 16 ], [ 32 ], [ 16, 8 ] ],
          queue: [ 32, 8, 4, 8, 4, 16, 8, 8, 16, 8, 8, 16, 16, 32, 32, 1, 1, 64 ],
          goal: 64,
          merge: true,
          pin: true,
          recipe: null,
          echo: true,
          bank_rule: true,
          ink_double: false,
          gold: 2,
          orders: [ 3, null, null, 0, null, null, 0, null, null, 0, null, null, 0, null, null, 1, null, null ],
          target: 597,
          perfect: {
            kind: "column_switches",
            maxSwitches: 13,
            text: "Switch columns at most 13 times without a revive."
          },
          metrics: {
            shots: 18,
            initial_blocks: 6,
            max_goal: 64,
            ordered_shots: 6
          }
        }, {
          id: 68,
          type: "main",
          columns: [ [ 32 ], [ 32 ], [ 32 ], [ 32, 8 ], [ 32 ] ],
          queue: [ 32, 16, 8, 16, 4, 32, 4, 8, 8, 8, 16, 1, 1, 64 ],
          goal: 64,
          merge: true,
          pin: true,
          recipe: null,
          echo: true,
          bank_rule: true,
          ink_double: false,
          gold: 2,
          orders: [ 0, null, null, 4, null, null, 1, null, null, 3, null, null, 3, null ],
          target: 469,
          perfect: {
            kind: "column_switches",
            maxSwitches: 11,
            text: "Switch columns at most 11 times without a revive."
          },
          metrics: {
            shots: 14,
            initial_blocks: 6,
            max_goal: 64,
            ordered_shots: 5
          }
        }, {
          id: 69,
          type: "main",
          columns: [ [ 32 ], [ 8 ], [ 32 ], [ 8 ], [ 16, 8 ] ],
          queue: [ 8, 8, 8, 8, 8, 16, 16, 8, 16, 16, 4, 4, 32, 8, 8, 16, 16, 16, 1, 1, 64 ],
          goal: 64,
          merge: true,
          pin: true,
          recipe: null,
          echo: true,
          bank_rule: true,
          ink_double: false,
          gold: 4,
          orders: [ 3, null, null, 4, null, null, 2, null, null, 0, null, null, 3, null, null, 4, null, null, 4, null, null ],
          target: 589,
          perfect: {
            kind: "column_switches",
            maxSwitches: 14,
            text: "Switch columns at most 14 times without a revive."
          },
          metrics: {
            shots: 21,
            initial_blocks: 6,
            max_goal: 64,
            ordered_shots: 7
          }
        }, {
          id: 70,
          type: "main",
          columns: [ [ 16 ], [ 32 ], [ 32 ], [ 8 ], [ 32 ] ],
          queue: [ 32, 16, 8, 32, 32, 4, 4, 32, 8, 16, 16, 1, 1, 64 ],
          goal: 64,
          merge: true,
          pin: true,
          recipe: null,
          echo: true,
          bank_rule: true,
          ink_double: false,
          gold: 3,
          orders: [ 1, null, null, 2, null, null, 3, null, null, 3, null, null, 3, null ],
          target: 517,
          perfect: {
            kind: "column_switches",
            maxSwitches: 7,
            text: "Switch columns at most 7 times without a revive."
          },
          metrics: {
            shots: 14,
            initial_blocks: 5,
            max_goal: 64,
            ordered_shots: 5
          }
        } ]
      },
      plan: {
        schema: "level_plan.v1",
        mode: "levels",
        why: "70 fixed column puzzles with progressively introduced merge, pin, recipe, echo and bank mechanics.",
        currency: "Sparks",
        total_levels: 70,
        milestone_every: 10,
        seed: 880088,
        bonus_multiplier: 3,
        limited_skin_mode: "final",
        levels: [ {
          level: 1,
          type: "normal",
          difficulty: 1,
          coins: 48,
          mechanics: [ "tap-shot", "equal-merge" ],
          tags: [ "intro" ],
          actual_metrics: {
            shots: 4,
            initial_blocks: 0,
            max_goal: 2,
            ordered_shots: 0
          },
          perfect: {
            kind: "column_switches",
            maxSwitches: 0,
            text: "Switch columns at most 0 times without a revive."
          }
        }, {
          level: 2,
          type: "normal",
          difficulty: 1.1,
          coins: 48,
          mechanics: [ "tap-shot", "equal-merge" ],
          tags: [ "intro" ],
          actual_metrics: {
            shots: 6,
            initial_blocks: 0,
            max_goal: 2,
            ordered_shots: 0
          },
          perfect: {
            kind: "column_switches",
            maxSwitches: 0,
            text: "Switch columns at most 0 times without a revive."
          }
        }, {
          level: 3,
          type: "normal",
          difficulty: 1.2,
          coins: 48,
          mechanics: [ "tap-shot", "equal-merge" ],
          actual_metrics: {
            shots: 8,
            initial_blocks: 0,
            max_goal: 2,
            ordered_shots: 0
          },
          perfect: {
            kind: "column_switches",
            maxSwitches: 0,
            text: "Switch columns at most 0 times without a revive."
          }
        }, {
          level: 4,
          type: "normal",
          difficulty: 1.3,
          coins: 48,
          mechanics: [ "tap-shot", "equal-merge" ],
          tags: [ "intro" ],
          actual_metrics: {
            shots: 4,
            initial_blocks: 2,
            max_goal: 4,
            ordered_shots: 0
          },
          perfect: {
            kind: "column_switches",
            maxSwitches: 2,
            text: "Switch columns at most 2 times without a revive."
          }
        }, {
          level: 5,
          type: "normal",
          difficulty: 1.4,
          coins: 48,
          mechanics: [ "tap-shot", "equal-merge" ],
          actual_metrics: {
            shots: 4,
            initial_blocks: 2,
            max_goal: 4,
            ordered_shots: 0
          },
          perfect: {
            kind: "column_switches",
            maxSwitches: 1,
            text: "Switch columns at most 1 times without a revive."
          }
        }, {
          level: 6,
          type: "bonus",
          difficulty: .6,
          coins: 144,
          new: true,
          bonus: "One free-choice golden ink shot; stored reward is already triple.",
          mechanics: [ "tap-shot", "equal-merge" ],
          actual_metrics: {
            shots: 2,
            initial_blocks: 1,
            max_goal: 8,
            ordered_shots: 0
          },
          perfect: {
            kind: "column_switches",
            maxSwitches: 0,
            text: "Switch columns at most 0 times without a revive."
          }
        }, {
          level: 7,
          type: "normal",
          difficulty: 1.6,
          coins: 48,
          mechanics: [ "tap-shot", "equal-merge" ],
          actual_metrics: {
            shots: 3,
            initial_blocks: 3,
            max_goal: 4,
            ordered_shots: 0
          },
          perfect: {
            kind: "column_switches",
            maxSwitches: 1,
            text: "Switch columns at most 1 times without a revive."
          }
        }, {
          level: 8,
          type: "normal",
          difficulty: 1.7,
          coins: 48,
          mechanics: [ "tap-shot", "equal-merge" ],
          actual_metrics: {
            shots: 3,
            initial_blocks: 2,
            max_goal: 4,
            ordered_shots: 0
          },
          perfect: {
            kind: "column_switches",
            maxSwitches: 1,
            text: "Switch columns at most 1 times without a revive."
          }
        }, {
          level: 9,
          type: "normal",
          difficulty: 1.8,
          coins: 48,
          mechanics: [ "tap-shot", "equal-merge" ],
          actual_metrics: {
            shots: 4,
            initial_blocks: 2,
            max_goal: 4,
            ordered_shots: 0
          },
          perfect: {
            kind: "column_switches",
            maxSwitches: 1,
            text: "Switch columns at most 1 times without a revive."
          }
        }, {
          level: 10,
          type: "milestone",
          difficulty: 1.9,
          coins: 48,
          frame: "Gold ink seal and chapter crown",
          reward: {
            type: "coins",
            amount: 340
          },
          mechanics: [ "tap-shot", "equal-merge" ],
          actual_metrics: {
            shots: 6,
            initial_blocks: 3,
            max_goal: 4,
            ordered_shots: 0
          },
          perfect: {
            kind: "column_switches",
            maxSwitches: 3,
            text: "Switch columns at most 3 times without a revive."
          }
        }, {
          level: 11,
          type: "normal",
          difficulty: 2,
          coins: 53,
          mechanics: [ "tap-shot", "equal-merge" ],
          actual_metrics: {
            shots: 5,
            initial_blocks: 4,
            max_goal: 4,
            ordered_shots: 0
          },
          perfect: {
            kind: "column_switches",
            maxSwitches: 2,
            text: "Switch columns at most 2 times without a revive."
          }
        }, {
          level: 12,
          type: "normal",
          difficulty: 2.1,
          coins: 53,
          mechanics: [ "tap-shot", "equal-merge", "loose-pin" ],
          tags: [ "intro" ],
          actual_metrics: {
            shots: 6,
            initial_blocks: 3,
            max_goal: 8,
            ordered_shots: 0
          },
          perfect: {
            kind: "column_switches",
            maxSwitches: 2,
            text: "Switch columns at most 2 times without a revive."
          }
        }, {
          level: 13,
          type: "bonus",
          difficulty: 1.2,
          coins: 159,
          new: true,
          bonus: "One free-choice golden ink shot; stored reward is already triple.",
          mechanics: [ "tap-shot", "equal-merge" ],
          actual_metrics: {
            shots: 2,
            initial_blocks: 2,
            max_goal: 8,
            ordered_shots: 0
          },
          perfect: {
            kind: "column_switches",
            maxSwitches: 0,
            text: "Switch columns at most 0 times without a revive."
          }
        }, {
          level: 14,
          type: "normal",
          difficulty: 2.3,
          coins: 53,
          mechanics: [ "tap-shot", "equal-merge", "loose-pin" ],
          actual_metrics: {
            shots: 7,
            initial_blocks: 3,
            max_goal: 8,
            ordered_shots: 0
          },
          perfect: {
            kind: "column_switches",
            maxSwitches: 3,
            text: "Switch columns at most 3 times without a revive."
          }
        }, {
          level: 15,
          type: "normal",
          difficulty: 2.4,
          coins: 53,
          mechanics: [ "tap-shot", "equal-merge", "loose-pin" ],
          actual_metrics: {
            shots: 8,
            initial_blocks: 3,
            max_goal: 8,
            ordered_shots: 0
          },
          perfect: {
            kind: "column_switches",
            maxSwitches: 4,
            text: "Switch columns at most 4 times without a revive."
          }
        }, {
          level: 16,
          type: "normal",
          difficulty: 2.5,
          coins: 53,
          mechanics: [ "tap-shot", "equal-merge", "loose-pin" ],
          actual_metrics: {
            shots: 7,
            initial_blocks: 5,
            max_goal: 8,
            ordered_shots: 0
          },
          perfect: {
            kind: "column_switches",
            maxSwitches: 5,
            text: "Switch columns at most 5 times without a revive."
          }
        }, {
          level: 17,
          type: "normal",
          difficulty: 2.6,
          coins: 53,
          mechanics: [ "tap-shot", "equal-merge", "loose-pin" ],
          actual_metrics: {
            shots: 6,
            initial_blocks: 7,
            max_goal: 8,
            ordered_shots: 0
          },
          perfect: {
            kind: "column_switches",
            maxSwitches: 3,
            text: "Switch columns at most 3 times without a revive."
          }
        }, {
          level: 18,
          type: "normal",
          difficulty: 2.7,
          coins: 53,
          mechanics: [ "tap-shot", "equal-merge", "loose-pin" ],
          actual_metrics: {
            shots: 7,
            initial_blocks: 4,
            max_goal: 8,
            ordered_shots: 0
          },
          perfect: {
            kind: "column_switches",
            maxSwitches: 3,
            text: "Switch columns at most 3 times without a revive."
          }
        }, {
          level: 19,
          type: "normal",
          difficulty: 2.8,
          coins: 53,
          mechanics: [ "tap-shot", "equal-merge", "loose-pin" ],
          actual_metrics: {
            shots: 7,
            initial_blocks: 4,
            max_goal: 8,
            ordered_shots: 0
          },
          perfect: {
            kind: "column_switches",
            maxSwitches: 3,
            text: "Switch columns at most 3 times without a revive."
          }
        }, {
          level: 20,
          type: "milestone",
          difficulty: 2.9,
          coins: 53,
          frame: "Gold ink seal and chapter crown",
          reward: {
            type: "coins",
            amount: 270
          },
          mechanics: [ "tap-shot", "equal-merge", "loose-pin" ],
          actual_metrics: {
            shots: 9,
            initial_blocks: 5,
            max_goal: 8,
            ordered_shots: 0
          },
          perfect: {
            kind: "column_switches",
            maxSwitches: 5,
            text: "Switch columns at most 5 times without a revive."
          }
        }, {
          level: 21,
          type: "normal",
          difficulty: 3,
          coins: 58,
          mechanics: [ "tap-shot", "equal-merge", "loose-pin" ],
          actual_metrics: {
            shots: 10,
            initial_blocks: 4,
            max_goal: 8,
            ordered_shots: 0
          },
          perfect: {
            kind: "column_switches",
            maxSwitches: 4,
            text: "Switch columns at most 4 times without a revive."
          }
        }, {
          level: 22,
          type: "normal",
          difficulty: 3.1,
          coins: 58,
          mechanics: [ "tap-shot", "equal-merge", "loose-pin", "recipe" ],
          tags: [ "intro" ],
          actual_metrics: {
            shots: 9,
            initial_blocks: 6,
            max_goal: 16,
            ordered_shots: 3
          },
          perfect: {
            kind: "column_switches",
            maxSwitches: 5,
            text: "Switch columns at most 5 times without a revive."
          }
        }, {
          level: 23,
          type: "bonus",
          difficulty: 1.8,
          coins: 174,
          new: true,
          bonus: "One free-choice golden ink shot; stored reward is already triple.",
          mechanics: [ "tap-shot", "equal-merge" ],
          actual_metrics: {
            shots: 2,
            initial_blocks: 3,
            max_goal: 16,
            ordered_shots: 0
          },
          perfect: {
            kind: "column_switches",
            maxSwitches: 0,
            text: "Switch columns at most 0 times without a revive."
          }
        }, {
          level: 24,
          type: "normal",
          difficulty: 3.3,
          coins: 58,
          mechanics: [ "tap-shot", "equal-merge", "loose-pin", "recipe" ],
          actual_metrics: {
            shots: 11,
            initial_blocks: 5,
            max_goal: 16,
            ordered_shots: 4
          },
          perfect: {
            kind: "column_switches",
            maxSwitches: 7,
            text: "Switch columns at most 7 times without a revive."
          }
        }, {
          level: 25,
          type: "normal",
          difficulty: 3.4,
          coins: 58,
          mechanics: [ "tap-shot", "equal-merge", "loose-pin", "recipe" ],
          actual_metrics: {
            shots: 12,
            initial_blocks: 9,
            max_goal: 16,
            ordered_shots: 4
          },
          perfect: {
            kind: "column_switches",
            maxSwitches: 8,
            text: "Switch columns at most 8 times without a revive."
          }
        }, {
          level: 26,
          type: "normal",
          difficulty: 3.5,
          coins: 58,
          mechanics: [ "tap-shot", "equal-merge", "loose-pin", "recipe" ],
          actual_metrics: {
            shots: 14,
            initial_blocks: 6,
            max_goal: 16,
            ordered_shots: 5
          },
          perfect: {
            kind: "column_switches",
            maxSwitches: 8,
            text: "Switch columns at most 8 times without a revive."
          }
        }, {
          level: 27,
          type: "normal",
          difficulty: 3.6,
          coins: 58,
          mechanics: [ "tap-shot", "equal-merge", "loose-pin", "recipe" ],
          actual_metrics: {
            shots: 14,
            initial_blocks: 7,
            max_goal: 16,
            ordered_shots: 5
          },
          perfect: {
            kind: "column_switches",
            maxSwitches: 8,
            text: "Switch columns at most 8 times without a revive."
          }
        }, {
          level: 28,
          type: "normal",
          difficulty: 3.7,
          coins: 58,
          mechanics: [ "tap-shot", "equal-merge", "loose-pin", "recipe" ],
          actual_metrics: {
            shots: 8,
            initial_blocks: 6,
            max_goal: 16,
            ordered_shots: 3
          },
          perfect: {
            kind: "column_switches",
            maxSwitches: 6,
            text: "Switch columns at most 6 times without a revive."
          }
        }, {
          level: 29,
          type: "normal",
          difficulty: 3.8,
          coins: 58,
          mechanics: [ "tap-shot", "equal-merge", "loose-pin", "recipe" ],
          actual_metrics: {
            shots: 7,
            initial_blocks: 6,
            max_goal: 16,
            ordered_shots: 2
          },
          perfect: {
            kind: "column_switches",
            maxSwitches: 4,
            text: "Switch columns at most 4 times without a revive."
          }
        }, {
          level: 30,
          type: "milestone",
          difficulty: 3.9,
          coins: 58,
          frame: "Gold ink seal and chapter crown",
          reward: {
            type: "coins",
            amount: 290
          },
          mechanics: [ "tap-shot", "equal-merge", "loose-pin", "recipe" ],
          actual_metrics: {
            shots: 9,
            initial_blocks: 6,
            max_goal: 16,
            ordered_shots: 3
          },
          perfect: {
            kind: "column_switches",
            maxSwitches: 6,
            text: "Switch columns at most 6 times without a revive."
          }
        }, {
          level: 31,
          type: "normal",
          difficulty: 4,
          coins: 63,
          mechanics: [ "tap-shot", "equal-merge", "loose-pin", "recipe" ],
          actual_metrics: {
            shots: 11,
            initial_blocks: 6,
            max_goal: 16,
            ordered_shots: 4
          },
          perfect: {
            kind: "column_switches",
            maxSwitches: 7,
            text: "Switch columns at most 7 times without a revive."
          }
        }, {
          level: 32,
          type: "normal",
          difficulty: 4.1,
          coins: 63,
          mechanics: [ "tap-shot", "equal-merge", "loose-pin", "recipe" ],
          actual_metrics: {
            shots: 15,
            initial_blocks: 8,
            max_goal: 16,
            ordered_shots: 5
          },
          perfect: {
            kind: "column_switches",
            maxSwitches: 12,
            text: "Switch columns at most 12 times without a revive."
          }
        }, {
          level: 33,
          type: "normal",
          difficulty: 4.2,
          coins: 63,
          mechanics: [ "tap-shot", "equal-merge", "loose-pin", "recipe" ],
          actual_metrics: {
            shots: 15,
            initial_blocks: 5,
            max_goal: 16,
            ordered_shots: 5
          },
          perfect: {
            kind: "column_switches",
            maxSwitches: 8,
            text: "Switch columns at most 8 times without a revive."
          }
        }, {
          level: 34,
          type: "bonus",
          difficulty: 2.4,
          coins: 189,
          new: true,
          bonus: "One free-choice golden ink shot; stored reward is already triple.",
          mechanics: [ "tap-shot", "equal-merge" ],
          actual_metrics: {
            shots: 2,
            initial_blocks: 4,
            max_goal: 32,
            ordered_shots: 0
          },
          perfect: {
            kind: "column_switches",
            maxSwitches: 0,
            text: "Switch columns at most 0 times without a revive."
          }
        }, {
          level: 35,
          type: "normal",
          difficulty: 4.4,
          coins: 63,
          mechanics: [ "tap-shot", "equal-merge", "loose-pin", "recipe" ],
          actual_metrics: {
            shots: 21,
            initial_blocks: 6,
            max_goal: 16,
            ordered_shots: 7
          },
          perfect: {
            kind: "column_switches",
            maxSwitches: 13,
            text: "Switch columns at most 13 times without a revive."
          }
        }, {
          level: 36,
          type: "normal",
          difficulty: 4.5,
          coins: 63,
          mechanics: [ "tap-shot", "equal-merge", "loose-pin", "recipe", "echo" ],
          tags: [ "intro" ],
          actual_metrics: {
            shots: 16,
            initial_blocks: 6,
            max_goal: 32,
            ordered_shots: 5
          },
          perfect: {
            kind: "column_switches",
            maxSwitches: 4,
            text: "Switch columns at most 4 times without a revive."
          }
        }, {
          level: 37,
          type: "normal",
          difficulty: 4.6,
          coins: 63,
          mechanics: [ "tap-shot", "equal-merge", "loose-pin", "recipe", "echo" ],
          actual_metrics: {
            shots: 18,
            initial_blocks: 5,
            max_goal: 32,
            ordered_shots: 6
          },
          perfect: {
            kind: "column_switches",
            maxSwitches: 10,
            text: "Switch columns at most 10 times without a revive."
          }
        }, {
          level: 38,
          type: "normal",
          difficulty: 4.7,
          coins: 63,
          mechanics: [ "tap-shot", "equal-merge", "loose-pin", "recipe", "echo" ],
          actual_metrics: {
            shots: 14,
            initial_blocks: 6,
            max_goal: 32,
            ordered_shots: 5
          },
          perfect: {
            kind: "column_switches",
            maxSwitches: 8,
            text: "Switch columns at most 8 times without a revive."
          }
        }, {
          level: 39,
          type: "normal",
          difficulty: 4.8,
          coins: 63,
          mechanics: [ "tap-shot", "equal-merge", "loose-pin", "recipe", "echo" ],
          actual_metrics: {
            shots: 13,
            initial_blocks: 6,
            max_goal: 32,
            ordered_shots: 4
          },
          perfect: {
            kind: "column_switches",
            maxSwitches: 7,
            text: "Switch columns at most 7 times without a revive."
          }
        }, {
          level: 40,
          type: "milestone",
          difficulty: 4.9,
          coins: 63,
          frame: "Gold ink seal and chapter crown",
          reward: {
            type: "coins",
            amount: 320
          },
          mechanics: [ "tap-shot", "equal-merge", "loose-pin", "recipe", "echo" ],
          actual_metrics: {
            shots: 8,
            initial_blocks: 5,
            max_goal: 32,
            ordered_shots: 3
          },
          perfect: {
            kind: "column_switches",
            maxSwitches: 6,
            text: "Switch columns at most 6 times without a revive."
          }
        }, {
          level: 41,
          type: "normal",
          difficulty: 5,
          coins: 68,
          mechanics: [ "tap-shot", "equal-merge", "loose-pin", "recipe", "echo" ],
          actual_metrics: {
            shots: 21,
            initial_blocks: 7,
            max_goal: 32,
            ordered_shots: 7
          },
          perfect: {
            kind: "column_switches",
            maxSwitches: 15,
            text: "Switch columns at most 15 times without a revive."
          }
        }, {
          level: 42,
          type: "bonus",
          difficulty: 3,
          coins: 204,
          new: true,
          bonus: "One free-choice golden ink shot; stored reward is already triple.",
          mechanics: [ "tap-shot", "equal-merge" ],
          actual_metrics: {
            shots: 2,
            initial_blocks: 5,
            max_goal: 64,
            ordered_shots: 0
          },
          perfect: {
            kind: "column_switches",
            maxSwitches: 0,
            text: "Switch columns at most 0 times without a revive."
          }
        }, {
          level: 43,
          type: "normal",
          difficulty: 5.2,
          coins: 68,
          mechanics: [ "tap-shot", "equal-merge", "loose-pin", "recipe", "echo" ],
          actual_metrics: {
            shots: 10,
            initial_blocks: 6,
            max_goal: 32,
            ordered_shots: 3
          },
          perfect: {
            kind: "column_switches",
            maxSwitches: 5,
            text: "Switch columns at most 5 times without a revive."
          }
        }, {
          level: 44,
          type: "normal",
          difficulty: 5.3,
          coins: 68,
          mechanics: [ "tap-shot", "equal-merge", "loose-pin", "recipe", "echo" ],
          actual_metrics: {
            shots: 13,
            initial_blocks: 5,
            max_goal: 32,
            ordered_shots: 4
          },
          perfect: {
            kind: "column_switches",
            maxSwitches: 7,
            text: "Switch columns at most 7 times without a revive."
          }
        }, {
          level: 45,
          type: "normal",
          difficulty: 5.4,
          coins: 68,
          mechanics: [ "tap-shot", "equal-merge", "loose-pin", "recipe", "echo" ],
          actual_metrics: {
            shots: 9,
            initial_blocks: 10,
            max_goal: 32,
            ordered_shots: 3
          },
          perfect: {
            kind: "column_switches",
            maxSwitches: 6,
            text: "Switch columns at most 6 times without a revive."
          }
        }, {
          level: 46,
          type: "normal",
          difficulty: 5.5,
          coins: 68,
          mechanics: [ "tap-shot", "equal-merge", "loose-pin", "recipe", "echo" ],
          actual_metrics: {
            shots: 9,
            initial_blocks: 6,
            max_goal: 32,
            ordered_shots: 3
          },
          perfect: {
            kind: "column_switches",
            maxSwitches: 5,
            text: "Switch columns at most 5 times without a revive."
          }
        }, {
          level: 47,
          type: "normal",
          difficulty: 5.6,
          coins: 68,
          mechanics: [ "tap-shot", "equal-merge", "loose-pin", "recipe", "echo" ],
          actual_metrics: {
            shots: 10,
            initial_blocks: 7,
            max_goal: 32,
            ordered_shots: 3
          },
          perfect: {
            kind: "column_switches",
            maxSwitches: 4,
            text: "Switch columns at most 4 times without a revive."
          }
        }, {
          level: 48,
          type: "normal",
          difficulty: 5.7,
          coins: 68,
          mechanics: [ "tap-shot", "equal-merge", "loose-pin", "recipe", "echo", "bank" ],
          tags: [ "intro" ],
          actual_metrics: {
            shots: 13,
            initial_blocks: 6,
            max_goal: 16,
            ordered_shots: 4
          },
          perfect: {
            kind: "column_switches",
            maxSwitches: 6,
            text: "Switch columns at most 6 times without a revive."
          }
        }, {
          level: 49,
          type: "normal",
          difficulty: 5.8,
          coins: 68,
          mechanics: [ "tap-shot", "equal-merge", "loose-pin", "recipe", "echo", "bank" ],
          actual_metrics: {
            shots: 21,
            initial_blocks: 5,
            max_goal: 16,
            ordered_shots: 7
          },
          perfect: {
            kind: "column_switches",
            maxSwitches: 14,
            text: "Switch columns at most 14 times without a revive."
          }
        }, {
          level: 50,
          type: "milestone",
          difficulty: 5.9,
          coins: 68,
          frame: "Gold ink seal and chapter crown",
          reward: {
            type: "coins",
            amount: 340
          },
          mechanics: [ "tap-shot", "equal-merge", "loose-pin", "recipe", "echo", "bank" ],
          actual_metrics: {
            shots: 14,
            initial_blocks: 6,
            max_goal: 16,
            ordered_shots: 5
          },
          perfect: {
            kind: "column_switches",
            maxSwitches: 8,
            text: "Switch columns at most 8 times without a revive."
          }
        }, {
          level: 51,
          type: "normal",
          difficulty: 6,
          coins: 73,
          mechanics: [ "tap-shot", "equal-merge", "loose-pin", "recipe", "echo", "bank" ],
          actual_metrics: {
            shots: 15,
            initial_blocks: 6,
            max_goal: 16,
            ordered_shots: 5
          },
          perfect: {
            kind: "column_switches",
            maxSwitches: 9,
            text: "Switch columns at most 9 times without a revive."
          }
        }, {
          level: 52,
          type: "normal",
          difficulty: 6.1,
          coins: 73,
          mechanics: [ "tap-shot", "equal-merge", "loose-pin", "recipe", "echo", "bank" ],
          actual_metrics: {
            shots: 13,
            initial_blocks: 7,
            max_goal: 16,
            ordered_shots: 4
          },
          perfect: {
            kind: "column_switches",
            maxSwitches: 8,
            text: "Switch columns at most 8 times without a revive."
          }
        }, {
          level: 53,
          type: "normal",
          difficulty: 6.2,
          coins: 73,
          mechanics: [ "tap-shot", "equal-merge", "loose-pin", "recipe", "echo", "bank" ],
          actual_metrics: {
            shots: 9,
            initial_blocks: 6,
            max_goal: 16,
            ordered_shots: 3
          },
          perfect: {
            kind: "column_switches",
            maxSwitches: 5,
            text: "Switch columns at most 5 times without a revive."
          }
        }, {
          level: 54,
          type: "bonus",
          difficulty: 3.6,
          coins: 219,
          new: true,
          bonus: "One free-choice golden ink shot; stored reward is already triple.",
          mechanics: [ "tap-shot", "equal-merge" ],
          actual_metrics: {
            shots: 3,
            initial_blocks: 6,
            max_goal: 128,
            ordered_shots: 0
          },
          perfect: {
            kind: "column_switches",
            maxSwitches: 1,
            text: "Switch columns at most 1 times without a revive."
          }
        }, {
          level: 55,
          type: "normal",
          difficulty: 6.4,
          coins: 73,
          mechanics: [ "tap-shot", "equal-merge", "loose-pin", "recipe", "echo", "bank" ],
          actual_metrics: {
            shots: 20,
            initial_blocks: 6,
            max_goal: 16,
            ordered_shots: 7
          },
          perfect: {
            kind: "column_switches",
            maxSwitches: 14,
            text: "Switch columns at most 14 times without a revive."
          }
        }, {
          level: 56,
          type: "normal",
          difficulty: 6.5,
          coins: 73,
          mechanics: [ "tap-shot", "equal-merge", "loose-pin", "recipe", "echo", "bank" ],
          actual_metrics: {
            shots: 14,
            initial_blocks: 5,
            max_goal: 32,
            ordered_shots: 5
          },
          perfect: {
            kind: "column_switches",
            maxSwitches: 7,
            text: "Switch columns at most 7 times without a revive."
          }
        }, {
          level: 57,
          type: "normal",
          difficulty: 6.6,
          coins: 73,
          mechanics: [ "tap-shot", "equal-merge", "loose-pin", "recipe", "echo", "bank" ],
          actual_metrics: {
            shots: 17,
            initial_blocks: 6,
            max_goal: 32,
            ordered_shots: 6
          },
          perfect: {
            kind: "column_switches",
            maxSwitches: 12,
            text: "Switch columns at most 12 times without a revive."
          }
        }, {
          level: 58,
          type: "normal",
          difficulty: 6.7,
          coins: 73,
          mechanics: [ "tap-shot", "equal-merge", "loose-pin", "recipe", "echo", "bank" ],
          actual_metrics: {
            shots: 12,
            initial_blocks: 8,
            max_goal: 32,
            ordered_shots: 4
          },
          perfect: {
            kind: "column_switches",
            maxSwitches: 6,
            text: "Switch columns at most 6 times without a revive."
          }
        }, {
          level: 59,
          type: "normal",
          difficulty: 6.8,
          coins: 73,
          mechanics: [ "tap-shot", "equal-merge", "loose-pin", "recipe", "echo", "bank" ],
          actual_metrics: {
            shots: 10,
            initial_blocks: 7,
            max_goal: 32,
            ordered_shots: 3
          },
          perfect: {
            kind: "column_switches",
            maxSwitches: 6,
            text: "Switch columns at most 6 times without a revive."
          }
        }, {
          level: 60,
          type: "milestone",
          difficulty: 6.9,
          coins: 73,
          frame: "Gold ink seal and chapter crown",
          reward: {
            type: "coins",
            amount: 370
          },
          mechanics: [ "tap-shot", "equal-merge", "loose-pin", "recipe", "echo", "bank" ],
          actual_metrics: {
            shots: 15,
            initial_blocks: 9,
            max_goal: 32,
            ordered_shots: 5
          },
          perfect: {
            kind: "column_switches",
            maxSwitches: 7,
            text: "Switch columns at most 7 times without a revive."
          }
        }, {
          level: 61,
          type: "normal",
          difficulty: 7,
          coins: 78,
          mechanics: [ "tap-shot", "equal-merge", "loose-pin", "recipe", "echo", "bank" ],
          actual_metrics: {
            shots: 13,
            initial_blocks: 6,
            max_goal: 32,
            ordered_shots: 4
          },
          perfect: {
            kind: "column_switches",
            maxSwitches: 7,
            text: "Switch columns at most 7 times without a revive."
          }
        }, {
          level: 62,
          type: "normal",
          difficulty: 7.1,
          coins: 78,
          mechanics: [ "tap-shot", "equal-merge", "loose-pin", "recipe", "echo", "bank" ],
          actual_metrics: {
            shots: 14,
            initial_blocks: 8,
            max_goal: 32,
            ordered_shots: 5
          },
          perfect: {
            kind: "column_switches",
            maxSwitches: 8,
            text: "Switch columns at most 8 times without a revive."
          }
        }, {
          level: 63,
          type: "normal",
          difficulty: 7.2,
          coins: 78,
          mechanics: [ "tap-shot", "equal-merge", "loose-pin", "recipe", "echo", "bank" ],
          actual_metrics: {
            shots: 17,
            initial_blocks: 7,
            max_goal: 32,
            ordered_shots: 6
          },
          perfect: {
            kind: "column_switches",
            maxSwitches: 10,
            text: "Switch columns at most 10 times without a revive."
          }
        }, {
          level: 64,
          type: "bonus",
          difficulty: 4.2,
          coins: 234,
          new: true,
          bonus: "One free-choice golden ink shot; stored reward is already triple.",
          mechanics: [ "tap-shot", "equal-merge" ],
          actual_metrics: {
            shots: 3,
            initial_blocks: 7,
            max_goal: 256,
            ordered_shots: 0
          },
          perfect: {
            kind: "column_switches",
            maxSwitches: 1,
            text: "Switch columns at most 1 times without a revive."
          }
        }, {
          level: 65,
          type: "normal",
          difficulty: 7.4,
          coins: 78,
          mechanics: [ "tap-shot", "equal-merge", "loose-pin", "recipe", "echo", "bank" ],
          actual_metrics: {
            shots: 20,
            initial_blocks: 10,
            max_goal: 64,
            ordered_shots: 7
          },
          perfect: {
            kind: "column_switches",
            maxSwitches: 11,
            text: "Switch columns at most 11 times without a revive."
          }
        }, {
          level: 66,
          type: "normal",
          difficulty: 7.5,
          coins: 78,
          mechanics: [ "tap-shot", "equal-merge", "loose-pin", "recipe", "echo", "bank" ],
          actual_metrics: {
            shots: 19,
            initial_blocks: 5,
            max_goal: 64,
            ordered_shots: 6
          },
          perfect: {
            kind: "column_switches",
            maxSwitches: 10,
            text: "Switch columns at most 10 times without a revive."
          }
        }, {
          level: 67,
          type: "normal",
          difficulty: 7.6,
          coins: 78,
          mechanics: [ "tap-shot", "equal-merge", "loose-pin", "recipe", "echo", "bank" ],
          actual_metrics: {
            shots: 18,
            initial_blocks: 6,
            max_goal: 64,
            ordered_shots: 6
          },
          perfect: {
            kind: "column_switches",
            maxSwitches: 13,
            text: "Switch columns at most 13 times without a revive."
          }
        }, {
          level: 68,
          type: "normal",
          difficulty: 7.7,
          coins: 78,
          mechanics: [ "tap-shot", "equal-merge", "loose-pin", "recipe", "echo", "bank" ],
          actual_metrics: {
            shots: 14,
            initial_blocks: 6,
            max_goal: 64,
            ordered_shots: 5
          },
          perfect: {
            kind: "column_switches",
            maxSwitches: 11,
            text: "Switch columns at most 11 times without a revive."
          }
        }, {
          level: 69,
          type: "normal",
          difficulty: 7.8,
          coins: 78,
          mechanics: [ "tap-shot", "equal-merge", "loose-pin", "recipe", "echo", "bank" ],
          actual_metrics: {
            shots: 21,
            initial_blocks: 6,
            max_goal: 64,
            ordered_shots: 7
          },
          perfect: {
            kind: "column_switches",
            maxSwitches: 14,
            text: "Switch columns at most 14 times without a revive."
          }
        }, {
          level: 70,
          type: "milestone",
          difficulty: 7.9,
          coins: 78,
          frame: "Gold ink seal and chapter crown",
          reward: {
            type: "skin",
            id: "hero_limited"
          },
          mechanics: [ "tap-shot", "equal-merge", "loose-pin", "recipe", "echo", "bank" ],
          actual_metrics: {
            shots: 14,
            initial_blocks: 5,
            max_goal: 64,
            ordered_shots: 5
          },
          perfect: {
            kind: "column_switches",
            maxSwitches: 7,
            text: "Switch columns at most 7 times without a revive."
          }
        } ]
      },
      table: {
        module: "skin.v1",
        coins_per_ad: 48,
        coins_per_level: 48,
        price_steps: [ 1, 4, 10, 20 ],
        mode: "levels",
        items: [ {
          id: "hero_limited",
          group: "skin",
          order: 1,
          rarity: "limited",
          limited: true,
          name: "Final Nib",
          art: "Final Nib \u2014 candy ink studio collection",
          bonus: {
            type: "coins",
            pct: 55
          },
          unlock: "level",
          level: 70,
          condition: "clear",
          ads: 0,
          coins: 0
        }, {
          id: "hero_01",
          group: "skin",
          order: 2,
          rarity: "common",
          unlock: "free",
          ads: 0,
          coins: 0,
          name: "Sable Default",
          art: "Sable Default \u2014 candy ink studio collection"
        }, {
          id: "hero_02",
          group: "skin",
          order: 3,
          rarity: "common",
          unlock: "coins",
          ads: 0,
          coins: 96,
          bonus: {
            type: "coins",
            pct: 5
          },
          name: "Ink Sable",
          art: "Ink Sable \u2014 candy ink studio collection"
        }, {
          id: "hero_03",
          group: "skin",
          order: 4,
          rarity: "common",
          unlock: "coins",
          ads: 0,
          coins: 144,
          bonus: {
            type: "coins",
            pct: 6
          },
          name: "Nib Sable",
          art: "Nib Sable \u2014 candy ink studio collection"
        }, {
          id: "hero_04",
          group: "skin",
          order: 5,
          rarity: "common",
          unlock: "coins",
          ads: 0,
          coins: 192,
          bonus: {
            type: "coins",
            pct: 7
          },
          name: "Blot Sable",
          art: "Blot Sable \u2014 candy ink studio collection"
        }, {
          id: "hero_05",
          group: "skin",
          order: 6,
          rarity: "common",
          unlock: "coins",
          ads: 0,
          coins: 240,
          bonus: {
            type: "coins",
            pct: 8
          },
          name: "Quill Sable",
          art: "Quill Sable \u2014 candy ink studio collection"
        }, {
          id: "hero_06",
          group: "skin",
          order: 7,
          rarity: "common",
          unlock: "coins",
          ads: 0,
          coins: 288,
          bonus: {
            type: "coins",
            pct: 8
          },
          name: "Press Sable",
          art: "Press Sable \u2014 candy ink studio collection"
        }, {
          id: "hero_07",
          group: "skin",
          order: 8,
          rarity: "common",
          unlock: "coins",
          ads: 0,
          coins: 336,
          bonus: {
            type: "coins",
            pct: 9
          },
          name: "Gloss Sable",
          art: "Gloss Sable \u2014 candy ink studio collection"
        }, {
          id: "hero_08",
          group: "skin",
          order: 9,
          rarity: "common",
          unlock: "coins",
          ads: 0,
          coins: 384,
          bonus: {
            type: "coins",
            pct: 10
          },
          name: "Dew Nib",
          art: "Dew Nib \u2014 candy ink studio collection"
        }, {
          id: "hero_09",
          group: "skin",
          order: 10,
          rarity: "rare",
          unlock: "coins",
          ads: 0,
          coins: 576,
          bonus: {
            type: "coins",
            pct: 12
          },
          name: "Sun Nib",
          art: "Sun Nib \u2014 candy ink studio collection"
        }, {
          id: "hero_10",
          group: "skin",
          order: 11,
          rarity: "rare",
          unlock: "coins",
          ads: 0,
          coins: 768,
          bonus: {
            type: "coins",
            pct: 13
          },
          name: "Amber Nib",
          art: "Amber Nib \u2014 candy ink studio collection"
        }, {
          id: "hero_11",
          group: "skin",
          order: 12,
          rarity: "rare",
          unlock: "coins",
          ads: 0,
          coins: 960,
          bonus: {
            type: "coins",
            pct: 15
          },
          name: "Lamp Nib",
          art: "Lamp Nib \u2014 candy ink studio collection"
        }, {
          id: "hero_12",
          group: "skin",
          order: 13,
          rarity: "rare",
          unlock: "coins",
          ads: 0,
          coins: 1152,
          bonus: {
            type: "coins",
            pct: 16
          },
          name: "Wick Nib",
          art: "Wick Nib \u2014 candy ink studio collection"
        }, {
          id: "hero_13",
          group: "skin",
          order: 14,
          rarity: "rare",
          unlock: "coins",
          ads: 0,
          coins: 1344,
          bonus: {
            type: "coins",
            pct: 18
          },
          name: "Patio Nib",
          art: "Patio Nib \u2014 candy ink studio collection"
        }, {
          id: "hero_14",
          group: "skin",
          order: 15,
          rarity: "rare",
          unlock: "coins",
          ads: 0,
          coins: 1536,
          bonus: {
            type: "coins",
            pct: 20
          },
          name: "Jelly Nib",
          art: "Jelly Nib \u2014 candy ink studio collection"
        }, {
          id: "hero_15",
          group: "skin",
          order: 16,
          rarity: "epic",
          unlock: "coins",
          ads: 0,
          coins: 2016,
          bonus: {
            type: "coins",
            pct: 24
          },
          name: "Marm Nib",
          art: "Marm Nib \u2014 candy ink studio collection"
        }, {
          id: "hero_16",
          group: "skin",
          order: 17,
          rarity: "epic",
          unlock: "coins",
          ads: 0,
          coins: 2496,
          bonus: {
            type: "coins",
            pct: 27
          },
          name: "Comb Nib",
          art: "Comb Nib \u2014 candy ink studio collection"
        }, {
          id: "hero_17",
          group: "skin",
          order: 18,
          rarity: "epic",
          unlock: "coins",
          ads: 0,
          coins: 2976,
          bonus: {
            type: "coins",
            pct: 30
          },
          name: "Cap Nib",
          art: "Cap Nib \u2014 candy ink studio collection"
        }, {
          id: "hero_18",
          group: "skin",
          order: 19,
          rarity: "legendary",
          unlock: "coins",
          ads: 0,
          coins: 3936,
          bonus: {
            type: "coins",
            pct: 38
          },
          name: "Fest Nib",
          art: "Fest Nib \u2014 candy ink studio collection"
        }, {
          id: "hero_19",
          group: "skin",
          order: 20,
          rarity: "legendary",
          unlock: "coins",
          ads: 0,
          coins: 4896,
          bonus: {
            type: "coins",
            pct: 45
          },
          name: "Last Nib",
          art: "Last Nib \u2014 candy ink studio collection"
        }, {
          id: "bg_01",
          group: "background",
          order: 1,
          rarity: "common",
          unlock: "free",
          ads: 0,
          coins: 0,
          name: "Studio Morning",
          art: "Studio Morning \u2014 candy ink studio collection"
        }, {
          id: "bg_02",
          group: "background",
          order: 2,
          rarity: "common",
          unlock: "coins",
          ads: 0,
          coins: 96,
          bonus: {
            type: "coins",
            pct: 2
          },
          name: "Lemon Press",
          art: "Lemon Press \u2014 candy ink studio collection"
        }, {
          id: "bg_03",
          group: "background",
          order: 3,
          rarity: "common",
          unlock: "coins",
          ads: 0,
          coins: 144,
          bonus: {
            type: "coins",
            pct: 3
          },
          name: "Mint Rail",
          art: "Mint Rail \u2014 candy ink studio collection"
        }, {
          id: "bg_04",
          group: "background",
          order: 4,
          rarity: "common",
          unlock: "coins",
          ads: 0,
          coins: 192,
          bonus: {
            type: "coins",
            pct: 5
          },
          name: "Berry Wall",
          art: "Berry Wall \u2014 candy ink studio collection"
        }, {
          id: "bg_05",
          group: "background",
          order: 5,
          rarity: "rare",
          unlock: "coins",
          ads: 0,
          coins: 384,
          bonus: {
            type: "coins",
            pct: 6
          },
          name: "Honey Wall",
          art: "Honey Wall \u2014 candy ink studio collection"
        }, {
          id: "bg_06",
          group: "background",
          order: 6,
          rarity: "rare",
          unlock: "coins",
          ads: 0,
          coins: 576,
          bonus: {
            type: "coins",
            pct: 8
          },
          name: "Grape Wall",
          art: "Grape Wall \u2014 candy ink studio collection"
        }, {
          id: "bg_07",
          group: "background",
          order: 7,
          rarity: "rare",
          unlock: "coins",
          ads: 0,
          coins: 768,
          bonus: {
            type: "coins",
            pct: 10
          },
          name: "Cocoa Wall",
          art: "Cocoa Wall \u2014 candy ink studio collection"
        }, {
          id: "bg_08",
          group: "background",
          order: 8,
          rarity: "epic",
          unlock: "coins",
          ads: 0,
          coins: 1248,
          bonus: {
            type: "coins",
            pct: 12
          },
          name: "Lamp Wall",
          art: "Lamp Wall \u2014 candy ink studio collection"
        }, {
          id: "bg_09",
          group: "background",
          order: 9,
          rarity: "epic",
          unlock: "coins",
          ads: 0,
          coins: 1728,
          bonus: {
            type: "coins",
            pct: 15
          },
          name: "Garden Wall",
          art: "Garden Wall \u2014 candy ink studio collection"
        }, {
          id: "bg_10",
          group: "background",
          order: 10,
          rarity: "legendary",
          unlock: "coins",
          ads: 0,
          coins: 2688,
          bonus: {
            type: "coins",
            pct: 20
          },
          name: "Final Wall",
          art: "Final Wall \u2014 candy ink studio collection"
        } ],
        limited_mode: "final"
      },
      platform: {
        appId: "7683427172773644296",
        clientKey: "mgq7o8c3rbhdx2kv",
        rewardedPlacementId: "ad7683064432721709074",
        rewardedPlacements: [ {
          name: "Rewarded 2",
          id: "ad7683064432721709074"
        }, {
          name: "Rewarded",
          id: "ad7683076047361067016"
        }, {
          name: "Rewarded",
          id: "ad7683199506230233095"
        } ]
      },
      checkin: {
        schema: "checkin_config.v1",
        title: "Daily Reward",
        mode: "cumulative",
        reset_hour: 0,
        R: 48,
        note: "Remake (user 2026-10-27): R = B = normal_level_coins of unlock_table.json (this example: B = 50). Coins: day 1 = 1B, day 3 = 2B, day 5 = 3B, day 7 = 6B. Skins are existing common/rare skins of the 20; owned -> fallback coins. Use energy only in games with an energy system.",
        days: [ {
          day: 1,
          rewards: [ {
            type: "coins",
            amount: 48
          } ]
        }, {
          day: 2,
          rewards: [ {
            type: "item",
            id: "nibs",
            amount: 4
          } ]
        }, {
          day: 3,
          rewards: [ {
            type: "coins",
            amount: 96
          } ]
        }, {
          day: 4,
          rewards: [ {
            type: "item",
            id: "nibs",
            amount: 8
          } ]
        }, {
          day: 5,
          rewards: [ {
            type: "coins",
            amount: 144
          } ]
        }, {
          day: 6,
          rewards: [ {
            type: "skin",
            id: "hero_03",
            fallback_coins: 144
          } ]
        }, {
          day: 7,
          big: true,
          title: "Mystery Gift",
          rewards: [ {
            type: "coins",
            amount: 288
          }, {
            type: "skin",
            id: "hero_04",
            fallback_coins: 240
          }, {
            type: "item",
            id: "nibs",
            amount: 4
          } ]
        } ]
      }
    };
    cc._RF.pop();
  }, {} ],
  GameAudioButton: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "393d4zAbTdDnbm//eEZLp78", "GameAudioButton");
    "use strict";
    var GameAudioManager = require("GameAudioManager");
    var GameAudioButton = cc.Class({
      extends: cc.Component,
      properties: {
        soundId: "sfx_ui_click"
      },
      statics: {
        attachAll: function attachAll(root) {
          root.getComponentsInChildren(cc.Button).forEach(function(btn) {
            if (btn.getComponent(GameAudioButton)) return;
            var bs = btn.addComponent(GameAudioButton);
            /back|close|cancel|\u8fd4\u56de|\u5173\u95ed/i.test(btn.node.name) && (bs.soundId = "sfx_ui_back");
          });
        }
      },
      onEnable: function onEnable() {
        this.node.on("click", this._onClick, this);
      },
      onDisable: function onDisable() {
        this.node.off("click", this._onClick, this);
      },
      _onClick: function _onClick() {
        var btn = this.getComponent(cc.Button);
        if (btn && !btn.interactable) return;
        var am = GameAudioManager.instance;
        if (!am) return;
        am.unlock();
        am.playSFX(this.soundId);
      }
    });
    module.exports = GameAudioButton;
    cc._RF.pop();
  }, {
    GameAudioManager: "GameAudioManager"
  } ],
  GameAudioConfig: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "ef0a9FhS3BBkbjfI8RFB9+G", "GameAudioConfig");
    "use strict";
    module.exports = {
      BGM: {
        bgm_menu: {
          path: "audio/bgm/bgm_menu",
          volume: .45
        },
        bgm_game: {
          path: "audio/bgm/bgm_game",
          volume: .4
        },
        jingle_win: {
          path: "audio/bgm/jingle_win",
          volume: .7
        },
        jingle_lose: {
          path: "audio/bgm/jingle_lose",
          volume: .55
        }
      },
      SFX: {
        sfx_ui_click: {
          path: "audio/sfx/sfx_ui_click",
          variants: 3,
          volume: .55
        },
        sfx_place: {
          path: "audio/sfx/sfx_place",
          variants: 3,
          volume: .65
        },
        sfx_match: {
          path: "audio/sfx/sfx_match",
          variants: 3,
          volume: .65
        },
        sfx_coin: {
          path: "audio/sfx/sfx_coin",
          volume: .6
        },
        sfx_reward_ad: {
          path: "audio/sfx/sfx_reward_ad",
          volume: .6
        },
        sfx_ui_popup_open: {
          path: "audio/sfx/sfx_ui_popup_open",
          volume: .5
        },
        sfx_ui_popup_close: {
          path: "audio/sfx/sfx_ui_popup_close",
          volume: .5
        },
        sfx_invalid: {
          path: "audio/sfx/sfx_invalid",
          volume: .5
        },
        sfx_pin: {
          path: "audio/sfx/sfx_pin",
          volume: .55
        },
        sfx_combo_1: {
          path: "audio/sfx/sfx_combo_1",
          volume: .65
        },
        sfx_combo_2: {
          path: "audio/sfx/sfx_combo_2",
          volume: .65
        },
        sfx_combo_3: {
          path: "audio/sfx/sfx_combo_3",
          volume: .65
        },
        sfx_combo_4: {
          path: "audio/sfx/sfx_combo_4",
          volume: .65
        },
        sfx_combo_5: {
          path: "audio/sfx/sfx_combo_5",
          volume: .65
        },
        sfx_star_1: {
          path: "audio/sfx/sfx_star_1",
          volume: .55
        },
        sfx_star_2: {
          path: "audio/sfx/sfx_star_2",
          volume: .55
        },
        sfx_star_3: {
          path: "audio/sfx/sfx_star_3",
          volume: .55
        }
      }
    };
    cc._RF.pop();
  }, {} ],
  GameAudioManager: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "5b80dQXkg5BZZuQ7y3sCcd+", "GameAudioManager");
    "use strict";
    function loadAudio(paths, type, done) {
      cc.assetManager.loadBundle("sound", function(err, bundle) {
        if (err) {
          done(err);
          return;
        }
        bundle.load(paths, type, done);
      });
    }
    var CONFIG = require("GameAudioConfig");
    var BGM = CONFIG.BGM || {};
    var SFX = CONFIG.SFX || {};
    var KEY = "game_audio_settings_v1";
    var BGM_BASE = .5;
    var SFX_BASE = .8;
    var JINGLE_BASE = .8;
    var SFX_MIN_INTERVAL = 50;
    var SFX_MAX_CONCURRENT = 6;
    var DUCK_LEVEL = .25;
    var FALLBACK = {
      sfx_ui_back: "sfx_ui_click",
      sfx_ui_toggle: "sfx_ui_click",
      sfx_ui_locked: "sfx_invalid",
      sfx_ui_popup_close: "sfx_ui_popup_open",
      sfx_ui_popup_open: "sfx_ui_click",
      sfx_swap: "sfx_select",
      sfx_hint: "sfx_reward",
      sfx_shuffle: "sfx_swap",
      sfx_booster: "sfx_reward",
      sfx_clear_big: "sfx_match",
      sfx_reward_ad: "sfx_reward",
      sfx_unlock: "sfx_reward",
      sfx_time_up: "sfx_invalid",
      sfx_heart_lose: "sfx_invalid",
      sfx_level_start: "sfx_ui_popup_open",
      sfx_spin: "sfx_coin",
      sfx_select: "sfx_ui_click",
      sfx_place: "sfx_select"
    };
    function clampLevel(v, def) {
      var n = Math.round(Number(v));
      return isFinite(n) ? Math.max(0, Math.min(10, n)) : def;
    }
    var GameAudioManager = cc.Class({
      extends: cc.Component,
      statics: {
        instance: null,
        init: function init() {
          if (GameAudioManager.instance) return GameAudioManager.instance;
          var node = new cc.Node("GameAudioManager");
          cc.director.getScene().addChild(node);
          return node.addComponent(GameAudioManager);
        }
      },
      onLoad: function onLoad() {
        if (GameAudioManager.instance && GameAudioManager.instance !== this) {
          this.node.destroy();
          return;
        }
        GameAudioManager.instance = this;
        cc.game.addPersistRootNode(this.node);
        this._clips = {};
        this._lastPlay = {};
        this._lastVariant = {};
        this._activeSfx = 0;
        this._transients = [];
        this._musicEpoch = 0;
        this._jingleEpoch = 0;
        this._sfxEpoch = 0;
        this._alive = true;
        this._settingsSaved = true;
        this._loadedBgm = "";
        this._currentBgm = "";
        this._pendingBgm = "";
        this._bgmAudioId = -1;
        this._bgmVolume = 0;
        this._fadeTask = null;
        this._pauseReasons = {};
        this._settings = {
          musicOn: true,
          sfxOn: true,
          musicLevel: 10,
          sfxLevel: 10,
          lastMusicLevel: 10,
          lastSFXLevel: 10
        };
        this._loadSettings();
        this._unlocked = !cc.sys.isBrowser;
        cc.game.on(cc.game.EVENT_HIDE, this._onHide, this);
        cc.game.on(cc.game.EVENT_SHOW, this._onShow, this);
        cc.director.on(cc.Director.EVENT_AFTER_SCENE_LAUNCH, this._hookFirstTouch, this);
        this._hookFirstTouch();
      },
      onDestroy: function onDestroy() {
        if (!this._alive) return;
        this._alive = false;
        this._musicEpoch++;
        this._jingleEpoch++;
        this._sfxEpoch++;
        this._stopFade();
        this._stopBgmAudio();
        this._stopTransients();
        GameAudioManager.instance === this && (GameAudioManager.instance = null);
        cc.game.off(cc.game.EVENT_HIDE, this._onHide, this);
        cc.game.off(cc.game.EVENT_SHOW, this._onShow, this);
        cc.director.off(cc.Director.EVENT_AFTER_SCENE_LAUNCH, this._hookFirstTouch, this);
      },
      _hookFirstTouch: function _hookFirstTouch() {
        if (this._unlocked) return;
        var canvas = cc.Canvas.instance;
        canvas && canvas.node && canvas.node.once(cc.Node.EventType.TOUCH_START, this.unlock, this);
      },
      unlock: function unlock() {
        if (this._unlocked) return;
        this._unlocked = true;
        if (this._pendingBgm) {
          var id = this._pendingBgm;
          this._pendingBgm = "";
          this.playBGM(id);
        }
      },
      _loadSettings: function _loadSettings() {
        try {
          var raw = cc.sys.localStorage.getItem(KEY);
          if (raw) {
            var s = JSON.parse(raw);
            var music = clampLevel(s.musicLevel, 10), sfx = clampLevel(s.sfxLevel, 10);
            this._settings.lastMusicLevel = clampLevel(s.lastMusicLevel, music || 10) || music || 10;
            this._settings.lastSFXLevel = clampLevel(s.lastSFXLevel, sfx || 10) || sfx || 10;
            this._settings.musicOn = false !== s.musicOn && music > 0;
            this._settings.sfxOn = false !== s.sfxOn && sfx > 0;
            this._settings.musicLevel = this._settings.musicOn ? music : 0;
            this._settings.sfxLevel = this._settings.sfxOn ? sfx : 0;
          }
        } catch (e) {
          cc.warn("[Audio] \u8bbe\u7f6e\u8bfb\u53d6\u5931\u8d25\uff0c\u4f7f\u7528\u9ed8\u8ba4\u503c", e);
        }
      },
      _saveSettings: function _saveSettings() {
        try {
          cc.sys.localStorage.setItem(KEY, JSON.stringify(this._settings));
          this._settingsSaved = true;
          return true;
        } catch (e) {
          this._settingsSaved = false;
          cc.warn("[Audio] \u8bbe\u7f6e\u4fdd\u5b58\u5931\u8d25\uff1b\u5f53\u524d\u8bbe\u7f6e\u4ec5\u672c\u6b21\u8fd0\u884c\u6709\u6548\uff0c\u53ef\u91cd\u8bd5\u4fdd\u5b58", e);
          return false;
        }
      },
      isSettingsSaved: function isSettingsSaved() {
        return this._settingsSaved;
      },
      retrySaveSettings: function retrySaveSettings() {
        return this._saveSettings();
      },
      isMusicOn: function isMusicOn() {
        return this._settings.musicOn;
      },
      isSFXOn: function isSFXOn() {
        return this._settings.sfxOn;
      },
      getMusicLevel: function getMusicLevel() {
        return this._settings.musicLevel;
      },
      getSFXLevel: function getSFXLevel() {
        return this._settings.sfxLevel;
      },
      setMusic: function setMusic(on) {
        this._settings.musicOn = !!on;
        this._settings.musicLevel = on ? this._settings.lastMusicLevel : 0;
        this._applyMusicSettings();
      },
      setSFX: function setSFX(on) {
        this._settings.sfxOn = !!on;
        this._settings.sfxLevel = on ? this._settings.lastSFXLevel : 0;
        this._applySFXSettings();
      },
      setMusicLevel: function setMusicLevel(level) {
        var value = clampLevel(level, this._settings.musicLevel);
        this._settings.musicLevel = value;
        this._settings.musicOn = value > 0;
        value > 0 && (this._settings.lastMusicLevel = value);
        this._applyMusicSettings();
      },
      setSFXLevel: function setSFXLevel(level) {
        var value = clampLevel(level, this._settings.sfxLevel);
        this._settings.sfxLevel = value;
        this._settings.sfxOn = value > 0;
        value > 0 && (this._settings.lastSFXLevel = value);
        this._applySFXSettings();
      },
      increaseMusicLevel: function increaseMusicLevel() {
        this.setMusicLevel(this.getMusicLevel() + 1);
      },
      decreaseMusicLevel: function decreaseMusicLevel() {
        this.setMusicLevel(this.getMusicLevel() - 1);
      },
      increaseSFXLevel: function increaseSFXLevel() {
        this.setSFXLevel(this.getSFXLevel() + 1);
      },
      decreaseSFXLevel: function decreaseSFXLevel() {
        this.setSFXLevel(this.getSFXLevel() - 1);
      },
      _applyMusicSettings: function _applyMusicSettings() {
        this._saveSettings();
        this._musicEpoch++;
        this._stopFade();
        this._refreshTransients("music");
        if (!this._musicScale()) {
          this._jingleEpoch++;
          this._setBgmVolume(0);
          this._stopBgmAudio();
          return;
        }
        if (this._paused()) {
          this._currentBgm = this._currentBgm || this._pendingBgm || "bgm_menu";
          return;
        }
        this._bgmPlaying() && this._loadedBgm === this._currentBgm ? this._setBgmVolume(this._bgmTarget(BGM[this._currentBgm])) : this.playBGM(this._currentBgm || this._pendingBgm || "bgm_menu");
      },
      _applySFXSettings: function _applySFXSettings() {
        this._saveSettings();
        this._sfxEpoch++;
        this._refreshTransients("sfx");
      },
      _musicScale: function _musicScale() {
        return this._settings.musicOn ? this._settings.musicLevel / 10 : 0;
      },
      _sfxScale: function _sfxScale() {
        return this._settings.sfxOn ? this._settings.sfxLevel / 10 : 0;
      },
      _paused: function _paused() {
        return Object.keys(this._pauseReasons).length > 0;
      },
      _pathsOf: function _pathsOf(e) {
        if (e.variants && e.variants > 1) {
          var list = [];
          for (var i = 1; i <= e.variants; i++) list.push(e.path + "_" + i);
          return list;
        }
        return [ e.path ];
      },
      preload: function preload(onDone) {
        var self = this, paths = [];
        Object.keys(SFX).forEach(function(k) {
          paths = paths.concat(self._pathsOf(SFX[k]));
        });
        BGM.bgm_menu && paths.push(BGM.bgm_menu.path);
        if (!paths.length) {
          onDone && onDone();
          return;
        }
        loadAudio(paths, cc.AudioClip, function(err, list) {
          err && cc.warn("[Audio] \u9884\u52a0\u8f7d\u6709\u5931\u8d25\u9879", err);
          (list || []).forEach(function(c, i) {
            c && (self._clips[paths[i]] = c);
          });
          onDone && onDone();
        });
      },
      _getClip: function _getClip(path, cb) {
        var self = this;
        if (this._clips[path]) {
          cb(this._clips[path]);
          return;
        }
        loadAudio(path, cc.AudioClip, function(err, clip) {
          if (err || !clip) {
            cc.warn("[Audio] \u52a0\u8f7d\u5931\u8d25", path);
            cb(null);
            return;
          }
          self._clips[path] = clip;
          cb(clip);
        });
      },
      _pickVariant: function _pickVariant(id, e) {
        if (!e.variants || e.variants <= 1) return e.path;
        var i = 1 + Math.floor(Math.random() * e.variants);
        i === this._lastVariant[id] && (i = i % e.variants + 1);
        this._lastVariant[id] = i;
        return e.path + "_" + i;
      },
      _setBgmVolume: function _setBgmVolume(v) {
        v = this._musicScale() ? v : 0;
        this._bgmVolume = v;
        this._bgmAudioId >= 0 && cc.audioEngine.setVolume(this._bgmAudioId, v);
      },
      _stopBgmAudio: function _stopBgmAudio() {
        this._bgmAudioId >= 0 && cc.audioEngine.stop(this._bgmAudioId);
        this._bgmAudioId = -1;
      },
      _bgmPlaying: function _bgmPlaying() {
        return this._bgmAudioId >= 0 && cc.audioEngine.getState(this._bgmAudioId) === cc.audioEngine.AudioState.PLAYING;
      },
      _bgmTarget: function _bgmTarget(e) {
        return BGM_BASE * this._musicScale() * (e && e.volume || 1);
      },
      _stopFade: function _stopFade() {
        if (this._fadeTask) {
          this.unschedule(this._fadeTask);
          this._fadeTask = null;
        }
      },
      _fadeTo: function _fadeTo(to, duration, done) {
        var self = this;
        this._stopFade();
        var from = this._bgmVolume, t = 0;
        if (duration <= 0) {
          this._setBgmVolume(to);
          done && done();
          return;
        }
        this._fadeTask = function(dt) {
          t += dt;
          var k = Math.min(t / duration, 1);
          self._setBgmVolume(from + (to - from) * k);
          if (k >= 1) {
            self._stopFade();
            done && done();
          }
        };
        this.schedule(this._fadeTask, 0);
      },
      playBGM: function playBGM(id, fadeIn) {
        var self = this, e = BGM[id];
        void 0 === fadeIn && (fadeIn = .5);
        if (!e) {
          cc.warn("[Audio] \u672a\u77e5 BGM", id);
          return;
        }
        if (!this._unlocked) {
          this._pendingBgm = id;
          return;
        }
        var ticket = ++this._musicEpoch;
        this._jingleEpoch++;
        if (!this._musicScale() || this._paused()) {
          this._currentBgm = id;
          return;
        }
        if (this._currentBgm === id && this._loadedBgm === id && this._bgmPlaying()) {
          this._fadeTo(this._bgmTarget(e), .3);
          return;
        }
        this._currentBgm = id;
        if (!this._settings.musicOn || this._paused()) return;
        var start = function start() {
          self._getClip(e.path, function(clip) {
            if (!clip || !self._alive || ticket !== self._musicEpoch || self._currentBgm !== id || !self._musicScale() || self._paused()) return;
            self._stopBgmAudio();
            self._loadedBgm = id;
            self._bgmVolume = 0;
            self._bgmAudioId = cc.audioEngine.play(clip, true, 0);
            self._fadeTo(self._bgmTarget(e), fadeIn);
          });
        };
        this._bgmPlaying() ? this._fadeTo(0, .3, start) : start();
      },
      playLevelBGM: function playLevelBGM(level) {
        var id = BGM.bgm_game_2 && level % 2 === 0 ? "bgm_game_2" : "bgm_game";
        this.playBGM(BGM[id] ? id : "bgm_menu");
      },
      stopBGM: function stopBGM(fadeOut) {
        var self = this;
        this._musicEpoch++;
        this._jingleEpoch++;
        this._currentBgm = "";
        this._pendingBgm = "";
        this._fadeTo(0, void 0 === fadeOut ? .3 : fadeOut, function() {
          self._stopBgmAudio();
        });
      },
      playJingle: function playJingle(id) {
        var self = this, e = BGM[id];
        if (!e) {
          cc.warn("[Audio] \u672a\u77e5 jingle", id);
          return;
        }
        if (!this._musicScale() || this._paused() || !this._unlocked) return;
        var ticket = ++this._musicEpoch, jingleTicket = ++this._jingleEpoch;
        this._fadeTo(this._bgmTarget(BGM[this._currentBgm]) * DUCK_LEVEL, .15);
        this._getClip(e.path, function(clip) {
          if (!clip || !self._alive || ticket !== self._musicEpoch || !self._musicScale() || self._paused()) return;
          self._playTransient(clip, "music", JINGLE_BASE * (e.volume || 1));
          self.scheduleOnce(function() {
            if (!self._alive || jingleTicket !== self._jingleEpoch || !self._musicScale() || self._paused()) return;
            self._fadeTo(0, .4, function() {
              self._stopBgmAudio();
              self._currentBgm = "";
            });
          }, .6 * (clip.duration || 1));
        });
      },
      _removeTransient: function _removeTransient(entry) {
        var index = this._transients.indexOf(entry);
        if (index < 0) return;
        cc.audioEngine.setVolume(entry.id, 0);
        cc.audioEngine.stop(entry.id);
        this.unschedule(entry.cleanup);
        this._transients.splice(index, 1);
        "sfx" === entry.kind && this._activeSfx--;
      },
      _stopTransients: function _stopTransients(kind) {
        var self = this;
        this._transients.slice().forEach(function(entry) {
          kind && entry.kind !== kind || self._removeTransient(entry);
        });
      },
      _refreshTransients: function _refreshTransients(kind) {
        var scale = "music" === kind ? this._musicScale() : this._sfxScale();
        if (!scale) {
          this._stopTransients(kind);
          return;
        }
        this._transients.forEach(function(entry) {
          entry.kind === kind && cc.audioEngine.setVolume(entry.id, entry.gain * scale);
        });
      },
      _playTransient: function _playTransient(clip, kind, gain) {
        var self = this, scale = "music" === kind ? this._musicScale() : this._sfxScale();
        if (!this._alive || !scale || this._paused()) return;
        var entry = {
          id: cc.audioEngine.play(clip, false, gain * scale),
          kind: kind,
          gain: gain
        };
        entry.cleanup = function() {
          self._removeTransient(entry);
        };
        this._transients.push(entry);
        "sfx" === kind && this._activeSfx++;
        this.scheduleOnce(entry.cleanup, Math.max(clip.duration || .1, .1));
      },
      playSFX: function playSFX(id, volumeScale) {
        var self = this;
        void 0 === volumeScale && (volumeScale = 1);
        if (!this._sfxScale() || !this._unlocked || this._paused()) return;
        var ticket = this._sfxEpoch;
        var guard = 0;
        while (!SFX[id] && FALLBACK[id] && guard++ < 4) id = FALLBACK[id];
        var e = SFX[id];
        if (!e) {
          cc.warn("[Audio] \u672a\u77e5\u97f3\u6548", id);
          return;
        }
        var now = Date.now();
        if (now - (this._lastPlay[id] || 0) < SFX_MIN_INTERVAL) return;
        if (this._activeSfx >= SFX_MAX_CONCURRENT) return;
        this._lastPlay[id] = now;
        this._getClip(this._pickVariant(id, e), function(clip) {
          if (!clip || !self._alive || ticket !== self._sfxEpoch || !self._sfxScale() || self._paused() || self._activeSfx >= SFX_MAX_CONCURRENT) return;
          self._playTransient(clip, "sfx", SFX_BASE * (e.volume || 1) * volumeScale);
        });
      },
      playCombo: function playCombo(level) {
        var max = 0;
        while (SFX["sfx_combo_" + (max + 1)]) max++;
        if (0 === max) {
          this.playSFX("sfx_match");
          return;
        }
        this.playSFX("sfx_combo_" + Math.min(Math.max(level, 1), max));
      },
      playStar: function playStar(index) {
        this.playSFX(SFX["sfx_star_" + index] ? "sfx_star_" + index : "sfx_star_1");
      },
      playCoins: function playCoins(count) {
        var self = this, n = Math.min(count, 8), ticket = this._sfxEpoch;
        for (var i = 0; i < n; i++) (function(k) {
          self.scheduleOnce(function() {
            self._alive && ticket === self._sfxEpoch && self.playSFX("sfx_coin", 1 - .05 * k);
          }, .06 * k);
        })(i);
      },
      pause: function pause(reason) {
        this._pauseReasons[reason] = true;
        this._musicEpoch++;
        this._jingleEpoch++;
        this._sfxEpoch++;
        this._stopFade();
        this._stopTransients();
        this._setBgmVolume(0);
        this._bgmAudioId >= 0 && cc.audioEngine.pause(this._bgmAudioId);
      },
      resume: function resume(reason) {
        delete this._pauseReasons[reason];
        if (this._paused()) return;
        if (this._musicScale() && this._currentBgm && this._unlocked) {
          if (this._bgmAudioId < 0 || this._loadedBgm !== this._currentBgm) {
            var id = this._currentBgm;
            this._currentBgm = "";
            this.playBGM(id);
            return;
          }
          cc.audioEngine.resume(this._bgmAudioId);
          this._fadeTo(this._bgmTarget(BGM[this._currentBgm]), .3);
        }
      },
      pauseAll: function pauseAll() {
        this.pause("ad");
      },
      resumeAll: function resumeAll() {
        this.resume("ad");
      },
      _onHide: function _onHide() {
        this.pause("hide");
      },
      _onShow: function _onShow() {
        this.resume("hide");
      }
    });
    module.exports = GameAudioManager;
    cc._RF.pop();
  }, {
    GameAudioConfig: "GameAudioConfig"
  } ],
  Game: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "9bbe7V8/uNJYaZLYoISb80N", "Game");
    "use strict";
    var R = require("Rules"), Store = require("Store"), Platform = require("Platform"), A = require("AdRewards"), Data = require("Data"), ButtonTouch = require("ButtonTouch"), Art = require("Art"), MissionFlow = require("../tiktok-platform/MissionFlow"), PlatformConfig = require("../tiktok-platform/PlatformConfig"), Checkin = require("DailyCheckin");
    var C = {
      ink: "#243D4A",
      muted: "#71838B",
      paper: "#F8F2E4",
      panel: "#FFFDF6",
      blue: "#73CDD4",
      green: "#9CD4A1",
      pink: "#EFADB7",
      gold: "#F0C46A",
      purple: "#C2ACE0",
      line: "#D8DDD4"
    };
    cc.Class({
      extends: cc.Component,
      onLoad: function onLoad() {
        cc.debug.setDisplayStats(false);
        this.inputEpoch = 0;
        this.generation = 0;
        this.screen = "boot";
        this.pointer = null;
        this.busy = false;
        this.hidden = false;
        this.modalNode = null;
        this.round = 0;
        this.page = 0;
        this.tab = "skin";
        this.store = new Store(cc.sys.localStorage, Data.table);
        this.platform = new Platform();
        this.adGate = A.createAdGate();
        this.hide = function() {
          this.hidden = true;
          this.platform.pause();
          this.inputEpoch++;
          this.pointerOwner && this.pointerOwner.cancel();
          "game" !== this.screen || this.modalNode || this.pause();
        }.bind(this);
        this.show = function() {
          this.hidden = false;
          this.bootTick = Platform.now();
          this.platform.resume();
          this.mission && this.mission.onShow();
        }.bind(this);
        cc.game.on(cc.game.EVENT_HIDE, this.hide);
        cc.game.on(cc.game.EVENT_SHOW, this.show);
        "undefined" !== typeof window && (window.__STX = {
          read: this.snapshot.bind(this)
        });
        this.boot();
      },
      onDestroy: function onDestroy() {
        this.generation++;
        var owner = this.round++;
        this.platform.dispose();
        this.mission && this.mission.dispose();
        cc.game.off(cc.game.EVENT_HIDE, this.hide);
        cc.game.off(cc.game.EVENT_SHOW, this.show);
        this.unscheduleAllCallbacks();
      },
      update: function update(dt) {
        if (this.hidden) return;
        if ("home" === this.screen && this.homeGift && cc.isValid(this.homeGift)) {
          this.giftTime = (this.giftTime || 0) + dt;
          var gf = Math.floor(this.giftTime / .12) % 30, visible = gf < 10 ? gf : 0;
          if (visible !== this.giftFrame) {
            this.giftFrame = visible;
            Art.paint(this.homeGift, "gift_" + ("0" + visible).slice(-2));
          }
        }
        "home" === this.screen && this.giftCountdown && this.updateGiftClock();
        this.platform.update();
        this.mission && this.mission.tick();
        if ("boot" === this.screen && !this.bootFailed && cc.sys.isBrowser) {
          var now = Platform.now();
          this.bootIdle += Math.max(0, now - this.bootTick) / 1e3;
          this.bootTick = now;
          this.bootIdle > 15 && this.bootError();
        }
        if (this.flight && !this.modalNode) {
          this.flight.time += dt;
          var f = this.flight, t = Math.min(1, f.time / .16);
          f.node.y = f.from + (f.to - f.from) * t;
          if (t >= 1) {
            f.node.destroy();
            this.flight = null;
            this.finishShot(f.column);
          }
        }
      },
      nodeAt: function nodeAt(name, x, y, w, h, parent) {
        var n = new cc.Node(name);
        n.parent = parent || this.layer;
        n.setContentSize(w || 0, h || 0);
        n.setPosition(x - 195, 422 - y);
        return n;
      },
      box: function box(name, x, y, w, h, color, parent, radius) {
        var n = this.nodeAt(name, x, y, w, h, parent), g = n.addComponent(cc.Graphics);
        g.fillColor = cc.Color.fromHEX(new cc.Color(), color);
        "Shade" === name && (g.fillColor = new cc.Color(70, 90, 95, 110));
        g.roundRect(-w / 2, -h / 2, w, h, null == radius ? 14 : radius);
        g.fill();
        var image = Art.box(name, color);
        image && Art.paint(n, image, "stretch");
        return n;
      },
      label: function label(text, x, y, size, color, w, parent) {
        var n = this.nodeAt("Text:" + text, x, y, w || 350, 70, parent), l = n.addComponent(cc.Label);
        n._sourceText = String(text);
        l.string = String(text);
        var phrase = Art.phrase(text);
        if (phrase) {
          l.enabled = false;
          var titleArt = new cc.Node("GeneratedText");
          titleArt.parent = n;
          titleArt.setContentSize(w || 350, (size || 18) * (String(text).length > 20 ? 2.8 : 1.65));
          titleArt._labelToHide = l;
          Art.paint(titleArt, phrase) || (l.enabled = true);
          n._imageText = true;
        } else if (Art.font() && "boot" !== this.screen && /^[0-9\s+%/.,:\u2212-]+$/.test(String(text))) {
          l.font = Art.font();
          l.string = String(text).toUpperCase().replace(/\xb7/g, "-").replace(/\u2026/g, "...").replace(/\u2212/g, "-");
          n._imageText = true;
        }
        if (!n._imageText) {
          l.fontFamily = "Arial Rounded MT Bold";
          l.isBold = true;
          if (String(text).length <= 40 && (size || 18) >= 18) {
            var outline = n.addComponent(cc.LabelOutline);
            outline.color = cc.Color.fromHEX(new cc.Color(), "#00646A");
            outline.width = 2;
          }
        }
        l.fontSize = size || 18;
        l.lineHeight = 1.25 * (size || 18);
        l.enableWrapText = true;
        l.overflow = cc.Label.Overflow.RESIZE_HEIGHT;
        l.horizontalAlign = cc.Label.HorizontalAlign.CENTER;
        n.width = w || 350;
        n.color = cc.Color.fromHEX(new cc.Color(), n._imageText ? "#FFFFFF" : String(text).length > 40 ? "#536D68" : (size || 18) >= 18 ? "#FFF4CD" : "#16746F");
        return n;
      },
      button: function button(name, text, x, y, w, h, color, fn, parent, disabled) {
        var n = this.box(name, x, y, w, h, color, parent);
        var b = n.addComponent(cc.Button);
        b.transition = cc.Button.Transition.SCALE;
        b.zoomScale = .96;
        b.interactable = true;
        n.opacity = disabled ? 120 : 255;
        var artId = Art.button(name, text), caption = this.label(text, 195, 422, Math.min(20, w < 80 ? 16 : 20), C.ink, w - 12, n);
        if (artId && Art.has(artId)) {
          var face = new cc.Node("Art:" + artId);
          face.parent = n;
          face.setContentSize(w, h);
          Art.paint(face, artId);
          var g = n.getComponent(cc.Graphics);
          g.enabled = false;
          caption.opacity = 0;
          caption._artCaption = true;
          if (/[\u4e00-\u9fff]/.test(caption.getComponent(cc.Label).string)) {
            caption.opacity = 255;
            caption.y = "PinHelp" === name ? h / 2 + 8 : -h / 2 - 10;
            caption.getComponent(cc.Label).fontSize = 10;
            caption.getComponent(cc.Label).lineHeight = 12;
          }
          face.setSiblingIndex(0);
        } else 0 !== name.indexOf("Column") && Art.paint(n, "ui_capsule", "stretch");
        var blockedText = "DailyClaim" === name ? "Today\u2019s reward was collected. Come back tomorrow." : 0 === name.indexOf("Level") ? "Clear the previous level to open this one." : "Double" === name ? "This clear already has its double reward." : "SpendNibs" === name ? "You need 4 Nibs to steady this pin." : "Revive" === name ? "This attempt already used its one revive." : "GiftAd" === name ? "The gift is cooling down. Come back when the timer ends." : "Equipped" === text ? "This look is already equipped." : 0 === name.indexOf("Buy:") ? "Clear Level 70 to unlock Final Nib." : "This is the volume limit.";
        n.addComponent(ButtonTouch).init(this, disabled ? function() {
          this.notice(blockedText);
        } : fn);
        return n;
      },
      reset: function reset(screen) {
        this.inputEpoch++;
        this.pointerOwner && this.pointerOwner.cancel();
        if (this.flight) {
          this.flight.node.destroy();
          this.flight = null;
        }
        this.pointer = null;
        this.screen = screen;
        this.modalNode = null;
        this.adCancel = null;
        this.layer && this.layer.destroy();
        this.layer = new cc.Node("Page:" + screen);
        this.layer.parent = this.node;
        var bg = this.box("Background", 195, 422, 440, 960, this.itemColor(this.store.data.background, true));
        "boot" !== screen && Art.paint(bg, this.store.data.background, true);
        if (this.audio) {
          this.audio.resume("menu");
          this.audio.resume("ad");
          this.audio.playBGM("game" === screen ? "bgm_game" : "bgm_menu");
        }
      },
      itemColor: function itemColor(id, pale) {
        var i = Data.table.items.findIndex(function(it) {
          return it.id === id;
        });
        var list = pale ? [ "#F8F2E4", "#EDF6ED", "#F5EBEE", "#EDF1F8", "#F8F1D9", "#F2EAF7" ] : [ "#73CDD4", "#EFADB7", "#F0C46A", "#9CD4A1", "#C2ACE0" ];
        return list[Math.max(0, i) % list.length];
      },
      header: function header(title) {
        this.box("Sparks", 114, 37, 132, 42, C.panel);
        var spark = this.nodeAt("SparkIcon", 61, 37, 28, 28);
        Art.paint(spark, "icon_spark");
        var count = this.label(this.store.data.sparks, 125, 37, 17, C.ink, 94);
        count.name = "CurrencyCount";
        this.box("Nibs", 228, 37, 88, 42, C.panel);
        var nib = this.nodeAt("NibIcon", 201, 37, 25, 25);
        Art.paint(nib, "icon_nib");
        count = this.label(this.store.data.nibs, 242, 37, 17, C.ink, 52);
        count.name = "NibCount";
        this.button("Settings", "=", 25, 37, 40, 40, C.blue, this.settings);
        this.box("Progress", 153, 79, 172, 26, C.panel);
        var crown = this.nodeAt("ProgressIcon", 85, 79, 22, 22);
        Art.paint(crown, "icon_crown");
        count = this.label(("game" === this.screen && this.level ? this.level.id : Math.min(70, this.store.data.cleared + 1)) + " / 70", 165, 79, 14, C.ink, 126);
        count.name = "ProgressCount";
        title && this.label(title, 195, 113, 22);
      },
      boot: function boot() {
        this.reset("boot");
        this.bootFailed = false;
        this.bootProgress = 0;
        this.bootIdle = 0;
        this.bootTick = Platform.now();
        var gen = ++this.generation;
        this.label("Cocos Creator", 195, 360, 25);
        this.label("Loading", 195, 410, 16, C.muted);
        this.box("LoadTrack", 195, 452, 220, 8, C.line);
        Art.load(function(err) {
          if (!cc.isValid(this) || gen !== this.generation || this.bootFailed) return;
          if (err) {
            this.bootError();
            return;
          }
          if (!this.audio) {
            this.audio = require("GameAudioManager").init();
            this.syncAudio();
          }
          this.bootFailed = true;
          this.save(function(s) {
            s.gift = A.migrateGift(s.gift);
            s.checkin || (s.checkin = Checkin.createCheckin(Data.checkin, Date.now()));
          }, function() {
            this.home();
            this.store.warning && this.notice(this.store.warning);
          });
        }.bind(this), function(completed) {
          if (gen !== this.generation || this.bootFailed || completed <= this.bootProgress) return;
          this.bootProgress = completed;
          this.bootIdle = 0;
          this.bootTick = Platform.now();
        }.bind(this));
      },
      bootError: function bootError() {
        this.bootFailed = true;
        this.generation++;
        this.label("Loading stopped. Please try again.", 195, 505, 17);
        this.button("BootRetry", "Retry", 195, 570, 200, 60, C.pink, this.boot);
      },
      home: function home() {
        this.platform.cancel(this.round);
        this.mission && this.mission.close();
        this.round++;
        this.busy = false;
        this.reset("home");
        this.header();
        var title = this.nodeAt("TitleLogo", 195, 194, 326, 172);
        Art.paint(title, "logo");
        cc.tween(title).repeatForever(cc.tween().by(2, {
          y: 5
        }, {
          easing: "sineInOut"
        }).by(2, {
          y: -5
        }, {
          easing: "sineInOut"
        })).start();
        this.label("A little ink. A clever shot.", 195, 295, 14, C.muted);
        var hero = this.nodeAt("HomeHero", 195, 391, 120, 120);
        Art.paint(hero, this.store.data.hero);
        cc.tween(hero).repeatForever(cc.tween().by(1.8, {
          y: 7
        }, {
          easing: "sineInOut"
        }).by(1.8, {
          y: -7
        }, {
          easing: "sineInOut"
        })).start();
        this.button("Play", "PLAY", 195, 526, 270, 76, C.green, function() {
          if (this.store.data.pending) {
            this.showSavedResult();
            return;
          }
          this.startLevel(Math.min(70, this.store.data.cleared + 1), false);
        });
        this.button("Gift", "Gift", 57, 412, 84, 84, C.gold, this.gift);
        this.button("Skins", "Skins", 333, 412, 84, 84, C.purple, function() {
          this.page = 0;
          this.tab = "skin";
          this.collection();
        });
        this.button("Map", "Map", 333, 625, 68, 68, C.blue, function() {
          this.page = Math.min(6, Math.floor(this.store.data.cleared / 10));
          this.map();
        });
        this.button("Shortcut", "Add to\nHome", 120, 748, 86, 86, C.panel, function() {
          this.openMission("shortcut");
        });
        this.button("Revisit", "Revisit", 270, 748, 86, 86, C.panel, function() {
          this.openMission("profile");
        });
        var daily = this.button("Daily", "", 57, 625, 68, 68, C.gold, this.daily);
        Art.paint(daily, "gift_open");
        this.label("Daily", 57, 672, 12, C.ink, 72);
        this.giftCountdown = this.label("", 57, 469, 12, C.ink, 80);
        this.updateGiftClock();
        this.label("Tap a column. Merge equal ink.", 195, 825, 14, C.muted);
        this.animateGift();
      },
      openMission: function openMission(kind) {
        this.mission || (this.mission = new MissionFlow({
          store: this.store,
          reward: function reward(k, d) {
            d.sparks = Math.min(99999, d.sparks + PlatformConfig.growthReward());
          },
          rewardText: {
            shortcut: "+" + PlatformConfig.growthReward() + " Sparks",
            profile: "+" + PlatformConfig.growthReward() + " Sparks"
          },
          render: function(v) {
            if (!v.open) return;
            var actions = !v["native"] || v.busy || v.claimed ? [] : [ {
              name: "MissionAction",
              text: "check" === v.action ? "Check reward" : "Open TikTok",
              color: C.green,
              fn: function fn() {
                "check" === this.mission.view().action ? this.mission.check() : this.mission.start();
              }
            } ];
            this.dialog("shortcut" === v.kind ? "Add to Home" : "Profile Revisit", v["native"] ? v.message : "Available in TikTok. Keep playing here for free.", actions, true, 440);
            this.adCancel = function() {
              this.mission.close();
            }.bind(this);
          }.bind(this),
          onGranted: function() {
            var n = this.layer.getChildByName("CurrencyCount");
            if (n) {
              n._sourceText = String(this.store.data.sparks);
              n.getComponent(cc.Label).string = n._sourceText;
            }
          }.bind(this)
        }));
        this.mission.store = this.store;
        this.mission.open(kind);
      },
      map: function map() {
        this.reset("map");
        this.header("The ink trail");
        var names = [ "Studio Lane", "Press Row", "Rail Court", "Wall Green", "Hedge Turn", "Cloud Steps", "Festival End" ];
        this.label("Chapter " + (this.page + 1) + " \xb7 " + names[this.page], 195, 151, 18);
        var self = this;
        for (var j = 0; j < 10; j++) (function(id, j) {
          var row = Data.plan.levels[id - 1], locked = id > self.store.data.cleared + 1, x = 105 + j % 2 * 180, y = 224 + 91 * Math.floor(j / 2);
          self.button("Level" + id, String(id) + ("bonus" === row.type ? " +" : ""), x, y, 120, 64, "milestone" === row.type ? C.gold : "bonus" === row.type ? C.pink : C.panel, function() {
            if (self.store.data.pending) {
              self.showSavedResult();
              return;
            }
            self.levelDetails(id);
          }, null, locked);
          if (self.store.data.stars[id]) for (var st = 0; st < self.store.data.stars[id]; st++) {
            var mark = self.nodeAt("MapStar" + id + "-" + st, x + 16 * (st - (self.store.data.stars[id] - 1) / 2), y + 40, 14, 14);
            Art.paint(mark, "star");
          }
        })(10 * this.page + j + 1, j);
        this.button("PrevChapter", "<", 53, 744, 65, 52, C.panel, function() {
          this.page = (this.page + 6) % 7;
          this.map();
        });
        this.label(this.page + 1 + " / 7  \xb7  70 levels", 195, 744, 16, C.ink, 220);
        this.button("NextChapter", ">", 337, 744, 65, 52, C.panel, function() {
          this.page = (this.page + 1) % 7;
          this.map();
        });
        this.button("MapHome", "Home", 195, 807, 155, 45, C.gold, this.home);
      },
      levelDetails: function levelDetails(id) {
        var l = Data.levels.levels[id - 1];
        this.dialog("Level " + id, "Clear all ink. Target " + l.target + ".\n" + l.perfect.text, [ {
          name: "EnterLevel",
          text: "Play",
          color: C.green,
          fn: function fn() {
            this.closeDialog();
            this.startLevel(id, false);
          }
        } ]);
      },
      startLevel: function startLevel(id, revived) {
        if (id < 1 || id > 70) {
          this.campaign();
          return;
        }
        this.platform.cancel(this.round);
        this.round++;
        this.level = Data.levels.levels[id - 1];
        this.state = R.initial(this.level);
        this.reviveState = null;
        this.revived = !!revived;
        this.runHero = this.store.data.trial && this.store.data.trial.level === id ? this.store.data.trial.id : this.store.data.hero;
        this.busy = false;
        this.drawGame();
        var row = Data.plan.levels[id - 1];
        if (row.tags && row.tags.indexOf("intro") >= 0) {
          var hints = {
            1: "Tap a column to shoot. Match two 1s to make 2 and clear them.",
            2: "Plan your shots. Switch columns at most the shown number of times for three stars.",
            4: "Equal tops merge. Two 2s make 4. Match the clear value to empty a column.",
            12: "The loose pin locks the board if ink remains. You never need to pull it.",
            22: "An order marks the only legal column for that shot. Other shots are free choices.",
            36: "Your first merge adds a one-time echo of 45 points.",
            48: "A merge of 4 or more banks its value. A later merge of two 1s cashes the bank."
          };
          this.dialog("One little tip", hints[id] || "Read the board before you shoot.", [ {
            name: "TutorialReady",
            text: "Got it",
            color: C.green,
            fn: this.closeDialog
          } ]);
        }
      },
      drawGame: function drawGame() {
        this.reset("game");
        var s = this.state, l = this.level, helpVisible = s.pin && !s.pinTapped && !s.helped && s.queue.length - s.qi === 1;
        this.header();
        this.button("Pause", "II", 341, 94, 54, 43, C.blue, this.pause);
        this.label("Score " + s.score + " / " + s.target + "     Bank " + s.bank, 150, 134, 16, C.ink, 280);
        this.label("Goal " + s.goal + "  \xb7  switches " + s.switches + " / " + l.perfect.maxSwitches, helpVisible ? 150 : 195, 164, 15, C.muted, helpVisible ? 270 : 350);
        var recipe = R.recipe(s), colors = [ C.blue, C.green, C.pink, C.purple, C.gold ];
        for (var c = 0; c < 5; c++) (function(c) {
          var x = 43 + 76 * c;
          this.button("Column" + c, "", x, 445, 68, 510, recipe === c ? "#E1EAD1" : "#E9EBE1", function() {
            this.shoot(c);
          });
          this.label(c + 1, x, 718, 19, C.ink, 70);
          for (var k = 0; k < s.cols[c].length; k++) {
            this.box("Block:" + c + ":" + k, x, 663 - 65 * k, 58, 56, colors[Math.min(4, Math.round(Math.log2(s.cols[c][k])))]);
            this.label(s.cols[c][k], x, 663 - 65 * k, 25, C.ink, 58);
          }
          recipe === c && this.label("ORDER", x, 210, 12, C.ink, 68);
        }).call(this, c);
        this.box("NextShot", 51, 777, 64, 62, this.itemColor(this.runHero, false));
        this.label(s.qi < s.queue.length ? s.queue[s.qi] : "-", 51, 777, 29, C.ink, 64);
        this.label("NEXT", 51, 819, 12, C.muted, 70);
        this.label("Queue: " + s.queue.slice(s.qi + 1, s.qi + 7).join("  "), s.pin && !s.pinTapped ? 192 : 201, 774, 16, C.ink, s.pin && !s.pinTapped ? 190 : 225);
        this.label(s.queue.length - s.qi + " shots left", 202, 805, 14, C.muted, 225);
        s.pin && !s.pinTapped && this.button("LoosePin", s.pinSafe ? "Safe pin" : "Danger pin", 337, 773, 82, 66, s.pinSafe ? C.green : C.pink, function() {
          if (this.busy) return;
          if (this.state.pinSafe) {
            R.apply(this.state, [ "pin" ]);
            this.afterMove();
            return;
          }
          this.reviveState = JSON.parse(JSON.stringify(this.state));
          this.dialog("Danger pin", "Pulling this pin ends this attempt. Close to keep playing.", [ {
            name: "PullPin",
            text: "Pull pin",
            color: C.pink,
            fn: function fn() {
              this.closeDialog();
              R.apply(this.state, [ "pin" ]);
              this.afterMove();
            }
          } ]);
        });
        helpVisible && this.button("PinHelp", "Steady pin", 341, 164, 72, 44, C.purple, this.pinHelp);
      },
      shoot: function shoot(c) {
        if (this.modalNode || "game" !== this.screen) return;
        if (!R.accepts(this.state, c)) {
          this.audio && this.audio.playSFX("sfx_invalid");
          this.toast("Use the marked column, or choose one with room.");
          return;
        }
        this.audio && this.audio.playSFX("sfx_ui_click");
        this.reviveState = JSON.parse(JSON.stringify(this.state));
        var value = this.state.queue[this.state.qi], landing = 663 - 65 * this.state.cols[c].length;
        if (this.store.data.settings.vibration) {
          var api = this.platform.ads.getSDK("vibrateShort");
          if (api) try {
            api.vibrateShort({
              fail: function fail() {}
            });
          } catch (e) {}
        }
        this.finishShot(c);
        if ("game" === this.screen) {
          var n = this.box("FlyingInk", 43 + 76 * c, 777, 45, 45, C.blue);
          this.label(value, 195, 422, 23, C.ink, 45, n);
          cc.tween(n).to(.16, {
            y: 422 - landing,
            opacity: 0
          }).call(function() {
            cc.isValid(n) && n.destroy();
          }).start();
        }
      },
      finishShot: function finishShot(c) {
        R.apply(this.state, [ "shot", c ]);
        if (this.audio) {
          this.audio.playSFX("sfx_place");
          this.state.mergedNow && this.audio.playCombo(Math.min(5, Math.max(1, Math.round(Math.log2(this.state.goal)))));
        }
        this.busy = false;
        this.afterMove();
        this.state.mergedNow && "game" === this.screen && this.mergeFx(c);
      },
      afterMove: function afterMove() {
        if (R.win(this.state)) {
          this.complete();
          return;
        }
        if (R.lose(this.state)) {
          this.drawGame();
          this.fail();
          return;
        }
        this.drawGame();
        this.state.cashedNow ? this.toast("Bank cashed!") : this.state.bankedNow && this.toast("Ink banked. Cash it with a pair of 1s.");
      },
      save: function save(change, next) {
        try {
          this.store.commit(change);
          this.syncAudio();
          next && next.call(this);
          return true;
        } catch (e) {
          this.dialog("Could not save", "Your last saved balance is safe. Retry saving to continue.", [ {
            name: "SaveRetry",
            text: "Retry",
            color: C.pink,
            fn: function fn() {
              this.closeDialog();
              this.save(change, next);
            }
          } ]);
          return false;
        }
      },
      complete: function complete() {
        var pct = A.bonusPct(Data.table, [ this.runHero, this.store.data.background ]), row = Data.plan.levels[this.level.id - 1], reward = A.resultReward(row.coins, pct), stars = this.revived ? 1 : this.state.switches <= this.level.perfect.maxSwitches ? 3 : 2, milestone = row.reward && "coins" === row.reward.type ? row.reward.amount : 0;
        try {
          this.store.clear(this.level.id, stars, reward.total, this.state.nibs, milestone);
          70 === this.level.id && this.store.data.owned.indexOf("hero_limited") < 0 && this.store.commit(function(s) {
            s.owned.push("hero_limited");
          });
          this.showSavedResult();
        } catch (e) {
          this.dialog("Could not save", "Your clear is ready. Retry saving to collect it once.", [ {
            name: "ClearSaveRetry",
            text: "Retry",
            color: C.pink,
            fn: function fn() {
              this.closeDialog();
              this.complete();
            }
          } ]);
        }
      },
      showSavedResult: function showSavedResult() {
        var p = this.store.data.pending;
        if (!p) {
          this.home();
          return;
        }
        this.reset("result");
        if (this.audio) {
          this.audio.playJingle("jingle_win");
          this.audio.playCoins(3);
        }
        this.header("Level " + p.level + " clear");
        for (var st = 0; st < 3; st++) {
          var star = this.nodeAt("ResultStar" + st, 131 + 64 * st, 212, 52, 52);
          Art.paint(star, "star");
          star.opacity = st < p.stars ? 255 : 80;
        }
        var celebrate = this.nodeAt("WinHero", 195, 300, 120, 110);
        Art.paint(celebrate, "win_hero");
        this.label(3 === p.stars ? "Perfect planning" : 2 === p.stars ? "Clear! Try fewer column switches." : "Clear after a revive", 195, 382, 17);
        this.label("+" + p.total + " Sparks", 195, 428, 27);
        this.label(p.doubled ? "Double reward collected" : "Base reward saved", 195, 469, 14, C.muted);
        this.button("Double", "Watch ad x2", 195, 542, 270, 70, C.purple, function() {
          var id = p.id;
          this.ad("result", function(ok) {
            ok ? this.save(function(s) {
              if (s.pending && s.pending.id === id && !s.pending.doubled) {
                s.sparks = Math.min(99999, s.sparks + s.pending.total);
                s.pending.doubled = true;
              }
            }, this.showSavedResult) : this.showSavedResult();
          });
        }, null, p.doubled);
        this.button("Next", 70 === p.level ? "Finish" : "No thanks \xb7 Next", 195, 632, 245, 64, C.green, function() {
          var id = p.level;
          this.save(function(s) {
            s.pending = null;
          }, function() {
            70 === id ? this.campaign() : this.nextWithTrial(id + 1);
          });
        });
        this.button("ResultHome", "Home", 101, 735, 145, 58, C.gold, function() {
          this.save(function(s) {
            s.pending = null;
          }, this.home);
        });
        this.button("Replay", "Replay", 289, 735, 145, 58, C.pink, function() {
          var id = p.level;
          this.save(function(s) {
            s.pending = null;
          }, function() {
            this.startLevel(id, false);
          });
        });
      },
      nextWithTrial: function nextWithTrial(id) {
        var candidates = Data.table.items.filter(function(it) {
          return "skin" === it.group && "coins" === it.unlock && this.store.data.owned.indexOf(it.id) < 0;
        }, this);
        if (id > 2 && (id - 3) % 3 === 0 && this.store.data.tryGate < id && candidates.length) {
          var it = candidates[0];
          this.save(function(s) {
            s.tryGate = id;
          }, function() {
            this.dialog("Try " + it.name, "One level only. +" + it.bonus.pct + "% Sparks.\nNo permanent unlock.", [ {
              name: "TrialAd",
              text: "Watch Ad to Try",
              color: C.purple,
              fn: function fn() {
                this.ad("try", function(ok) {
                  ok ? this.save(function(s) {
                    s.trial = {
                      id: it.id,
                      level: id
                    };
                  }, function() {
                    this.startLevel(id, false);
                  }) : this.startLevel(id, false);
                });
              }
            }, {
              name: "TrialDecline",
              text: "No Thanks",
              color: C.green,
              fn: function fn() {
                this.closeDialog();
                this.startLevel(id, false);
              }
            } ]);
          });
        } else this.startLevel(id, false);
      },
      fail: function fail() {
        this.audio && this.audio.playJingle("jingle_lose");
        var left = this.state.queue.length - this.state.qi;
        this.dialog(1 === left ? "So close" : "Ink tangled", "No Sparks were lost. Try a different column.", [ {
          name: "Retry",
          text: "Retry",
          color: C.pink,
          fn: function fn() {
            this.startLevel(this.level.id, false);
          }
        }, {
          name: "FailHome",
          text: "Home",
          color: C.gold,
          fn: this.home
        }, {
          name: "Revive",
          text: "Watch ad \xb7 Revive",
          color: C.purple,
          disabled: this.revived,
          fn: function fn() {
            this.ad("revive", function(ok) {
              if (ok) {
                this.state = JSON.parse(JSON.stringify(this.reviveState || R.initial(this.level)));
                this.revived = true;
                this.busy = false;
                this.drawGame();
              } else this.fail();
            });
          }
        } ], false);
      },
      pause: function pause() {
        if ("game" !== this.screen || this.modalNode) return;
        this.audio && this.audio.pause("menu");
        this.dialog("Paused", "Take your time.", [ {
          name: "Resume",
          text: "Resume",
          color: C.green,
          fn: this.closeDialog
        }, {
          name: "Restart",
          text: "Restart",
          color: C.pink,
          fn: function fn() {
            this.startLevel(this.level.id, false);
          }
        }, {
          name: "PauseHome",
          text: "Home",
          color: C.gold,
          fn: this.home
        } ], false);
      },
      pinHelp: function pinHelp() {
        var cost = 4;
        this.dialog("Steady the pin", "Make this pin safe once.\nUse 4 Nibs or watch a video.", [ {
          name: "SpendNibs",
          text: "Buy",
          color: C.blue,
          disabled: this.store.data.nibs < cost,
          fn: function fn() {
            this.save(function(s) {
              s.nibs -= cost;
            }, function() {
              R.apply(this.state, [ "help" ]);
              this.drawGame();
            });
          }
        }, {
          name: "PinAd",
          text: "Watch ad \xb7 Help",
          color: C.purple,
          fn: function fn() {
            this.ad("pin", function(ok) {
              ok && R.apply(this.state, [ "help" ]);
              this.drawGame();
            });
          }
        } ]);
      },
      updateGiftClock: function updateGiftClock() {
        var ms = A.giftRemainingMs(this.store.data.gift), secs = Math.ceil(ms / 1e3), text = secs ? ("0" + Math.floor(secs / 60)).slice(-2) + ":" + ("0" + secs % 60).slice(-2) : "READY";
        if (this.giftCountdown && cc.isValid(this.giftCountdown) && this.giftCountdown._sourceText !== text) {
          this.giftCountdown._sourceText = text;
          this.giftCountdown.getComponent(cc.Label).string = text;
        }
      },
      daily: function daily() {
        var now = Date.now(), st = this.store.data.checkin || Checkin.createCheckin(Data.checkin, now), v = Checkin.checkinStatus(st, Data.checkin, now);
        this.dialog("Daily reward", "", [], true, 650);
        v.days.forEach(function(day, i) {
          var rewards = day.rewards.map(function(r) {
            return "coins" === r.type ? r.amount + " Sparks" : "item" === r.type ? r.amount + " Nibs" : Data.table.items.find(function(it) {
              return it.id === r.id;
            }).name;
          }).join(" + ");
          this.label("Day " + day.day + " - " + ("claimed" === day.state ? "Collected" : rewards), 195, 264 + 38 * i, 13, C.ink, 300, this.modalNode);
        }, this);
        this.button("DailyClaim", v.can_claim ? "Claim" : "Collected", 195, 568, 240, 55, C.green, function() {
          this.save(function(s) {
            var r = Checkin.claimCheckin(s.checkin || Checkin.createCheckin(Data.checkin, Date.now()), Data.checkin, Date.now(), s.owned);
            s.checkin = r.state;
            r.rewards.forEach(function(it) {
              "coins" === it.type ? s.sparks = Math.min(99999, s.sparks + it.amount) : "item" === it.type ? s.nibs = Math.min(99, s.nibs + it.amount) : "skin" === it.type && s.owned.indexOf(it.id) < 0 && s.owned.push(it.id);
            });
          }, function() {
            this.home();
            this.daily();
          });
        }, this.modalNode, !v.can_claim);
      },
      gift: function gift() {
        var amount = A.giftReward(48, Data.table, this.store.data.owned, this.store.data.cleared);
        this.dialog("A little spark", "Gift: " + amount + " Sparks\nAvailable every 30 minutes.", [ {
          name: "GiftAd",
          text: "Watch ad \xb7 Claim",
          color: C.purple,
          disabled: !A.giftAvailable(this.store.data.gift),
          fn: function fn() {
            this.ad("gift", function(ok) {
              if (!ok) {
                this.home();
                return;
              }
              this.save(function(s) {
                var r = A.claimGift(s.gift, 48, Data.table, s.owned, s.cleared);
                s.gift = r.state;
                s.sparks = Math.min(99999, s.sparks + r.coins);
              }, this.home);
            });
          }
        } ]);
      },
      collection: function collection() {
        this.reset("collection");
        this.header("Sable collection");
        this.button("Heroes", "Heroes", 102, 163, 160, 48, "skin" === this.tab ? C.purple : C.panel, function() {
          this.tab = "skin";
          this.page = 0;
          this.collection();
        });
        this.button("Backgrounds", "Backgrounds", 288, 163, 170, 48, "background" === this.tab ? C.purple : C.panel, function() {
          this.tab = "background";
          this.page = 0;
          this.collection();
        });
        var items = Data.table.items.filter(function(it) {
          return it.group === this.tab;
        }, this), max = Math.ceil(items.length / 3);
        this.page = (this.page % max + max) % max;
        items.slice(3 * this.page, 3 * this.page + 3).forEach(function(it, j) {
          var y = 271 + 165 * j, own = this.store.data.owned.indexOf(it.id) >= 0, equipped = this.store.data.hero === it.id || this.store.data.background === it.id;
          this.box("Card:" + it.id, 195, y, 350, 148, C.panel);
          var preview = this.nodeAt("Preview:" + it.id, 64, y, "skin" === it.group ? 86 : 88, "skin" === it.group ? 100 : 54);
          Art.paint(preview, "background" === it.group ? "preview_" + it.id : it.id);
          var name = this.label(it.name, 238, y - 46, 19, C.ink, 232);
          name.name = "ItemName:" + it.id;
          var bonus = this.label("+" + (it.bonus ? it.bonus.pct : 0) + "% Sparks", 236, y - 17, 14, C.muted, 220);
          bonus.name = "ItemBonus:" + it.id;
          var price = this.label(own ? "Owned" : "level" === it.unlock ? "Clear Level " + it.level : it.coins + " Sparks", 236, y + 7, 14, C.muted, 220);
          price.name = "ItemPrice:" + it.id;
          this.button("Buy:" + it.id, equipped ? "Equipped" : own ? "Equip" : "level" === it.unlock ? "Locked" : "Buy", 246, y + 45, 146, 56, own ? C.green : C.gold, function() {
            try {
              this.store.buy(it.id);
              this.collection();
            } catch (e) {
              this.notice("Not enough Sparks" === e.message ? "Not enough Sparks yet. Clear levels to earn more." : "Clear level " + it.level + " to unlock this skin.");
            }
          }, null, equipped || !own && "level" === it.unlock);
        }, this);
        this.button("CollectionPrev", "<", 58, 735, 68, 48, C.panel, function() {
          this.page--;
          this.collection();
        });
        this.label(this.page + 1 + " / " + max, 195, 735, 17);
        this.button("CollectionNext", ">", 332, 735, 68, 48, C.panel, function() {
          this.page++;
          this.collection();
        });
        this.button("CollectionHome", "Home", 195, 803, 170, 48, C.gold, this.home);
      },
      settings: function settings() {
        this.settingTab = this.settingTab || "general";
        this.drawSettings();
      },
      drawSettings: function drawSettings() {
        var t = this.store.data.settings, actions = [];
        if ("general" === this.settingTab) actions = [ {
          name: "HowTo",
          text: "How to Play",
          color: C.green,
          fn: function fn() {
            this.notice("Tap a column. Equal blocks merge. Clear every stack and empty the bank. Limit column switches for three stars.");
          }
        }, {
          name: "Vibration",
          text: "Vibration: " + (t.vibration ? "On" : "Off"),
          color: C.panel,
          fn: function fn() {
            this.save(function(s) {
              s.settings.vibration = !s.settings.vibration;
            }, this.drawSettings);
          }
        } ]; else {
          [ "music", "sfx" ].forEach(function(k) {
            actions.push({
              name: "Toggle:" + k,
              text: ("music" === k ? "Music" : "Sound Effects") + ": " + (t[k] && t["music" === k ? "musicVolume" : "sfxVolume"] > 0 ? "On" : "Off"),
              color: C.panel,
              fn: function fn() {
                this.save(function(s) {
                  s.settings[k] = !s.settings[k];
                }, this.drawSettings);
              }
            });
          }, this);
          actions.push({
            name: "MusicVolume",
            text: "Music volume: " + (t.music ? t.musicVolume : 0) + "/10",
            color: C.blue,
            fn: function fn() {
              this.volume("musicVolume");
            }
          }, {
            name: "SfxVolume",
            text: "Effects volume: " + (t.sfx ? t.sfxVolume : 0) + "/10",
            color: C.blue,
            fn: function fn() {
              this.volume("sfxVolume");
            }
          });
        }
        this.dialog("Settings \xb7 " + ("general" === this.settingTab ? "General" : "Sound"), "", actions, true, "general" === this.settingTab ? 400 : 536);
        this.button("SettingsTab", "general" === this.settingTab ? "Sound >" : "< General", 195, 422 - ("general" === this.settingTab ? 400 : 536) / 2 + 148, 230, 44, C.purple, function() {
          this.settingTab = "general" === this.settingTab ? "sound" : "general";
          this.drawSettings();
        }, this.modalNode);
      },
      volume: function volume(key) {
        var value = this.store.data.settings[key], enabled = this.store.data.settings["musicVolume" === key ? "music" : "sfx"];
        value = enabled ? value : 0;
        this.dialog("musicVolume" === key ? "Music volume" : "Effects volume", (enabled ? value : 0) + " / 10", [ {
          name: "VolumeMinus",
          text: "\u2212",
          color: C.blue,
          disabled: 0 === value,
          fn: function fn() {
            this.save(function(s) {
              s.settings[key] > 1 ? s.settings[key]-- : s.settings["musicVolume" === key ? "music" : "sfx"] = false;
            }, function() {
              this.volume(key);
            });
          }
        }, {
          name: "VolumePlus",
          text: "+",
          color: C.blue,
          disabled: 10 === value,
          fn: function fn() {
            this.save(function(s) {
              var kind = "musicVolume" === key ? "music" : "sfx";
              s.settings[key] = s.settings[kind] ? Math.min(10, s.settings[key] + 1) : 1;
              s.settings[kind] = true;
            }, function() {
              this.volume(key);
            });
          }
        } ]);
      },
      campaign: function campaign() {
        this.reset("campaign");
        this.header("Every drop counts");
        this.label("70 / 70", 195, 330, 62, C.gold);
        this.label("You completed the ink trail!", 195, 430, 25);
        this.button("CampaignHome", "Home", 195, 585, 240, 70, C.green, this.home);
      },
      ad: function ad(role, done) {
        if (!this.platform.available(role)) {
          this.dialog("Video unavailable", "Videos are unavailable here.\nKeep playing for free.", [ {
            name: "AdReturn",
            text: "Continue for free",
            color: C.green,
            fn: function fn() {
              this.closeDialog();
              done.call(this, false);
            }
          } ], true, 390);
          this.adCancel = function() {
            done.call(this, false);
          }.bind(this);
          return;
        }
        var token = A.adGateStart(this.adGate);
        if (!token) {
          this.toast("A video is already pending.");
          return;
        }
        this.audio && this.audio.pause("ad");
        this.dialog("Rewarded video", "Waiting for a video\u2026\nYou can close and continue for free.", [], true, 360);
        var owner = this.round, finish = function(ok, message) {
          this.audio && this.audio.resume("ad");
          var completed = A.adGateFinish(this.adGate, token, ok);
          if (owner !== this.round) return;
          this.closeDialog();
          done.call(this, completed);
          !ok && message && this.toast(message);
        }.bind(this);
        this.adCancel = function() {
          this.platform.cancel(owner);
        }.bind(this);
        this.platform.request(role, owner, finish);
      },
      dialog: function dialog(title, text, actions, close, height) {
        this.inputEpoch++;
        this.pointerOwner && this.pointerOwner.cancel();
        this.modalNode && this.modalNode.destroy();
        this.pointer = null;
        var n = new cc.Node("Dialog:" + title);
        n.setContentSize(390, 844);
        n.parent = this.layer;
        this.modalNode = n;
        var shade = this.box("Shade", 195, 422, 500, 1e3, "#79858A", n);
        shade.opacity = 255;
        shade.addComponent(cc.BlockInputEvents);
        var h = height || Math.max(390, 280 + 64 * actions.length);
        this.box("DialogPanel", 195, 422, 360, h, C.panel, n);
        this.label(title, 195, 422 - h / 2 + (h > 500 ? 100 : 90), title.length > 15 ? 17 : 21, C.ink, 285, n);
        if (text) {
          var picture = this.nodeAt("DialogIllustration", 87, 422 - h / 2 + 140, 56, 54, n);
          Art.paint(picture, /gift|spark/i.test(title) ? "gift_open" : /close|tangled/i.test(title) ? "fail_hero" : "hero_01");
          this.label(text, 230, 422 - h / 2 + (text.length > 100 ? 158 : 142), 14, C.muted, 210, n);
        }
        actions.forEach(function(a, i) {
          this.button(a.name, a.text, 195, 422 - h / 2 + 203 + 64 * i, 264, 55, a.color || C.panel, a.fn, n, a.disabled);
        }, this);
        false !== close && this.button("Close", "Close", 195, 422 + h / 2 - 84, 150, 40, C.pink, function() {
          var cancel = this.adCancel;
          this.adCancel = null;
          this.closeDialog();
          cancel && cancel();
        }, n);
      },
      closeDialog: function closeDialog() {
        if (this.audio) {
          this.audio.resume("menu");
          this.audio.playSFX("sfx_ui_popup_close");
        }
        this.pointer = null;
        if (this.modalNode) {
          var previous = this.modalNode._previousDialog;
          this.modalNode.destroy();
          this.modalNode = cc.isValid(previous) ? previous : null;
          this.modalNode && (this.modalNode.active = true);
        }
        this.adCancel = null;
      },
      notice: function notice(text) {
        var previous = this.modalNode;
        if (previous) {
          previous.active = false;
          this.modalNode = null;
        }
        this.dialog("A quick note", text, [], true, 330);
        this.modalNode._previousDialog = previous;
      },
      toast: function toast(text) {
        this.toastNode && this.toastNode.destroy();
        var n = this.box("Toast", 195, 92, 354, 60, C.panel);
        this.label(text, 195, 422, 15, C.ink, 330, n);
        this.toastNode = n;
        var g = this.generation;
        this.scheduleOnce(function() {
          cc.isValid(n) && g === this.generation && n.destroy();
        }, 2.2);
      },
      syncAudio: function syncAudio() {
        if (!this.audio) return;
        var t = this.store.data.settings;
        this.audio.setMusicLevel(t.musicVolume);
        this.audio.setSFXLevel(t.sfxVolume);
        this.audio.setMusic(t.music);
        this.audio.setSFX(t.sfx);
      },
      animateGift: function animateGift() {
        var gift = this.layer.getChildByName("Gift");
        if (!gift || !Art.has("gift_00")) return;
        var face = gift.getChildByName("Art:icon_gift");
        face && (face.active = false);
        var anim = new cc.Node("GiftAnimation");
        anim.parent = gift;
        anim.setContentSize(76, 76);
        this.homeGift = anim;
        this.giftTime = 0;
        this.giftFrame = -1;
        Art.paint(anim, "gift_00");
      },
      mergeFx: function mergeFx(column) {
        var n = this.nodeAt("MergeSpark", 43 + 76 * column, 640 - 65 * this.state.cols[column].length, 26, 26);
        Art.paint(n, "star");
        cc.tween(n).to(.4, {
          scale: 1.8,
          opacity: 0,
          y: n.y + 35
        }).call(function() {
          n.destroy();
        }).start();
      },
      snapshot: function snapshot() {
        var buttons = [], labels = [];
        function visit(n) {
          if (!n.activeInHierarchy) return;
          n.getComponent(cc.Label) && labels.push(n._sourceText || n.getComponent(cc.Label).string);
          if (n.getComponent(cc.Button)) {
            var b = n.getBoundingBoxToWorld();
            buttons.push({
              name: n.name,
              x: b.x + b.width / 2,
              y: b.y + b.height / 2,
              width: b.width,
              height: b.height,
              enabled: n.getComponent(cc.Button).interactable
            });
          }
          n.children.forEach(visit);
        }
        this.layer && visit(this.layer);
        return JSON.parse(JSON.stringify({
          screen: this.screen,
          dialog: this.modalNode && this.modalNode.name,
          dialogId: this.modalNode && this.modalNode.uuid,
          labels: labels,
          round: this.round,
          level: this.level && this.level.id,
          state: this.state,
          save: this.store.data,
          busy: this.busy,
          buttons: buttons,
          visible: cc.view.getVisibleSize(),
          canvas: cc.view.getFrameSize()
        }));
      }
    });
    cc._RF.pop();
  }, {
    "../tiktok-platform/MissionFlow": "MissionFlow",
    "../tiktok-platform/PlatformConfig": "PlatformConfig",
    AdRewards: "AdRewards",
    Art: "Art",
    ButtonTouch: "ButtonTouch",
    DailyCheckin: "DailyCheckin",
    Data: "Data",
    GameAudioManager: "GameAudioManager",
    Platform: "Platform",
    Rules: "Rules",
    Store: "Store"
  } ],
  HomeGrowthEntries: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "e646a2Dux5EJqw9IgsmaKkU", "HomeGrowthEntries");
    "use strict";
    var MissionFlow = require("./MissionFlow");
    var TEXT = {
      shortcut: "Add to Home",
      profile: "Profile Revisit",
      unsupported: "Available in TikTok",
      collected: "Collected"
    };
    var ICON_WAIT_MS = 2e3;
    function Controller(options) {
      options = options || {};
      if (!options.store) throw new Error("HomeGrowthEntries needs the game SaveStore");
      var self = this;
      this.config = options.config || require("./PlatformConfig");
      this.toast = "function" === typeof options.toast ? options.toast : function() {};
      this.renderState = "function" === typeof options.render ? options.render : function() {};
      this.iconFallback = {
        shortcut: false,
        profile: false
      };
      this.lastView = null;
      this.flow = new MissionFlow({
        store: options.store,
        config: this.config,
        missions: options.missions,
        native: options["native"],
        missionTimeoutMs: options.missionTimeoutMs,
        render: function render(view) {
          self.lastView = view;
          self._render();
        },
        onGranted: options.onGranted
      });
      this._render();
    }
    Controller.TEXT = TEXT;
    Controller.prototype.rewardAmount = function() {
      try {
        return this.config.growthReward();
      } catch (_) {
        return 0;
      }
    };
    Controller.prototype.state = function() {
      var flow = this.flow, amount = this.rewardAmount(), self = this, view = this.lastView;
      function entry(kind) {
        var claimed = flow.isClaimed(kind);
        return {
          kind: kind,
          title: TEXT[kind],
          claimed: claimed,
          reward: claimed ? TEXT.collected : amount > 0 ? "+" + amount : "",
          busy: !!(view && view.kind === kind && view.busy),
          iconFallback: self.iconFallback[kind],
          text: self.iconFallback[kind] ? TEXT[kind] + (claimed ? "\n" + TEXT.collected : amount > 0 ? "\n+" + amount : "") : ""
        };
      }
      return {
        shortcut: entry("shortcut"),
        profile: entry("profile"),
        message: view ? view.message : "",
        native: flow["native"]
      };
    };
    Controller.prototype._render = function() {
      try {
        this.renderState(this.state());
      } catch (_) {}
    };
    Controller.prototype.press = function(kind) {
      if ("shortcut" !== kind && "profile" !== kind) return "ignored";
      var flow = this.flow;
      if (!flow["native"]) {
        this.toast(TEXT.unsupported);
        return "unsupported";
      }
      if (flow.isClaimed(kind)) {
        this.toast(MissionFlow.TEXT.claimed);
        return "claimed";
      }
      if (flow.kind !== kind) {
        flow.open(kind);
        return "opened";
      }
      var view = flow.view();
      if (view.busy) return "busy";
      if ("check" === view.action) {
        flow.check();
        return "check";
      }
      flow.start();
      return "start";
    };
    Controller.prototype.iconFailed = function(kind) {
      if (false === this.iconFallback[kind]) {
        this.iconFallback[kind] = true;
        this._render();
      }
    };
    Controller.prototype.onShow = function() {
      this.flow.onShow();
    };
    Controller.prototype.tick = function() {
      this.flow.tick();
    };
    Controller.prototype.dispose = function() {
      this.flow.dispose();
    };
    function platformToast(text) {
      var sdk = "undefined" !== typeof TTMinis && TTMinis && TTMinis.game || "undefined" !== typeof tt && tt || null;
      if (sdk && "function" === typeof sdk.showToast) try {
        sdk.showToast({
          title: text,
          icon: "none",
          duration: 2e3
        });
        return true;
      } catch (_) {}
      return false;
    }
    function textureLoaded(sprite) {
      var frame = sprite && sprite.spriteFrame;
      var texture = frame && "function" === typeof frame.getTexture ? frame.getTexture() : null;
      return !!(texture && texture.loaded);
    }
    var exported = {
      Controller: Controller,
      TEXT: TEXT
    };
    "undefined" !== typeof cc && cc && "function" === typeof cc.Class && (exported = cc.Class({
      extends: cc.Component,
      properties: {
        shortcutNode: {
          default: null,
          type: cc.Node
        },
        profileNode: {
          default: null,
          type: cc.Node
        },
        messageLabel: {
          default: null,
          type: cc.Label
        }
      },
      statics: {
        Controller: Controller,
        TEXT: TEXT
      },
      init: function init(store, options) {
        options = options || {};
        var self = this;
        this.controller && this.controller.dispose();
        this.controller = new Controller({
          store: store,
          onGranted: options.onGranted,
          missions: options.missions,
          native: options["native"],
          toast: function toast(text) {
            platformToast(text) || self._message(text);
          },
          render: function render(state) {
            self._paint(state);
          }
        });
        [ "shortcut", "profile" ].forEach(function(kind) {
          var node = self[kind + "Node"];
          if (!node) {
            cc.error("HomeGrowthEntries: " + kind + "Node is not set");
            return;
          }
          node.active = true;
          node.off(cc.Node.EventType.TOUCH_END, self["_tap_" + kind], self);
          self["_tap_" + kind] = function() {
            self.controller.press(kind);
          };
          node.on(cc.Node.EventType.TOUCH_END, self["_tap_" + kind], self);
          var sprite = node.getComponent(cc.Sprite);
          if (!sprite || !sprite.spriteFrame) {
            self.controller.iconFailed(kind);
            return;
          }
          self.scheduleOnce(function() {
            textureLoaded(sprite) || self.controller.iconFailed(kind);
          }, ICON_WAIT_MS / 1e3);
        });
        if (!this._onShow) {
          this._onShow = function() {
            self.controller && self.controller.onShow();
          };
          cc.game.on(cc.game.EVENT_SHOW, this._onShow);
        }
        this.controller._render();
        return this.controller;
      },
      _label: function _label(node) {
        var child = node.getChildByName("HomeEntryText");
        if (!child) {
          child = new cc.Node("HomeEntryText");
          child.parent = node;
          var label = child.addComponent(cc.Label);
          label.fontSize = 24;
          label.lineHeight = 28;
          label.horizontalAlign = cc.Label.HorizontalAlign.CENTER;
          label.overflow = cc.Label.Overflow.SHRINK;
          child.setContentSize(node.width || 160, node.height || 80);
          child.color = cc.Color.WHITE;
        }
        return child.getComponent(cc.Label);
      },
      _paint: function _paint(state) {
        var self = this;
        [ "shortcut", "profile" ].forEach(function(kind) {
          var node = self[kind + "Node"];
          if (!node) return;
          var e = state[kind], label = self._label(node);
          label.string = e.iconFallback ? e.title + (e.reward ? "\n" + e.reward : "") : e.reward;
          label.node.active = "" !== label.string;
          var button = node.getComponent(cc.Button);
          button && (button.interactable = !e.busy);
        });
        state.message && this._message(state.message);
      },
      _message: function _message(text) {
        if (this.messageLabel) {
          this.messageLabel.string = text;
          this.messageLabel.node.active = true;
        }
      },
      update: function update() {
        this.controller && this.controller.tick();
      },
      onDestroy: function onDestroy() {
        this._onShow && cc.game.off(cc.game.EVENT_SHOW, this._onShow);
        this.controller && this.controller.dispose();
        this.controller = null;
      }
    }));
    module.exports = exported;
    cc._RF.pop();
  }, {
    "./MissionFlow": "MissionFlow",
    "./PlatformConfig": "PlatformConfig"
  } ],
  MissionFlow: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "a976eeR72hCR4rWFF7i7J0C", "MissionFlow");
    "use strict";
    var TikTokMissionService = require("./TikTokMissionService");
    var TEXT = {
      intro_shortcut: "Add this game to your home screen, open it from the new icon, then come back for your reward.",
      intro_profile: "Open your TikTok Profile, open this game from the sidebar, then come back for your reward.",
      opening: "Opening TikTok...",
      navigated: "Now open the game from that entry, then tap CHECK REWARD.",
      checking: "Checking your reward...",
      wait: "Please wait for the current request.",
      granted: "Reward received: ",
      claimed: "Reward already collected.",
      saveFailed: "Could not save your reward. Please try again.",
      preview: "LOCAL PREVIEW: open the game inside TikTok to use this."
    };
    var KINDS = {
      shortcut: true,
      profile: true
    };
    function hasNativeSDK() {
      var candidates = [ "undefined" !== typeof TTMinis && TTMinis && TTMinis.game, "undefined" !== typeof tt && tt, "undefined" !== typeof wx && wx ];
      for (var i = 0; i < candidates.length; i++) {
        var c = candidates[i];
        if (c && ("object" === typeof c || "function" === typeof c) && "function" === typeof c.canIUse) return true;
      }
      return false;
    }
    function MissionFlow(options) {
      options = options || {};
      var copy = {};
      for (var key in options) Object.prototype.hasOwnProperty.call(options, key) && (copy[key] = options[key]);
      options = copy;
      if (options.store && void 0 === options.reward && "function" === typeof options.render) {
        var growth = options.config || require("./PlatformConfig");
        options.reward = function(kind, draft) {
          draft.coins = (Number(draft.coins) || 0) + growth.growthReward();
        };
        if (!options.rewardText) {
          var amount = "";
          try {
            amount = "+" + growth.growthReward() + " Coins";
          } catch (_) {}
          options.rewardText = {
            shortcut: amount,
            profile: amount
          };
        }
      }
      if (!options.store || "function" !== typeof options.reward || "function" !== typeof options.render) throw new Error("MissionFlow needs store, reward(kind, draft) and render(view)");
      this.store = options.store;
      this.reward = options.reward;
      this.renderView = options.render;
      this.onGranted = options.onGranted || null;
      this.rewardText = options.rewardText || {
        shortcut: "",
        profile: ""
      };
      this.ownsMissions = !options.missions;
      this.missions = options.missions || new TikTokMissionService(options.missionTimeoutMs ? {
        timeoutMs: options.missionTimeoutMs
      } : void 0);
      this["native"] = void 0 !== options["native"] ? !!options["native"] : hasNativeSDK();
      this.kind = null;
      this.phase = "closed";
      this.message = "";
      this.version = 0;
      this.op = 0;
    }
    MissionFlow.prototype.isClaimed = function(kind) {
      return this.store.isClaimed(kind);
    };
    MissionFlow.prototype.view = function() {
      var claimed = !!this.kind && this.isClaimed(this.kind);
      var busy = "opening" === this.phase || "checking" === this.phase;
      return {
        open: null !== this.kind,
        kind: this.kind,
        phase: this.phase,
        busy: busy,
        claimed: claimed,
        message: this.message,
        native: this["native"],
        rewardText: this.kind && this.rewardText[this.kind] || "",
        action: claimed ? "none" : "idle" === this.phase && this.navigatedOnce ? "check" : "start",
        canStart: !busy && !claimed,
        canCheck: !busy && !claimed
      };
    };
    MissionFlow.prototype._render = function() {
      try {
        this.renderView(this.view());
      } catch (_) {}
    };
    MissionFlow.prototype._guard = function() {
      var self = this, version = this.version, kind = this.kind;
      return function() {
        return self.version === version && self.kind === kind;
      };
    };
    MissionFlow.prototype.open = function(kind) {
      if (!KINDS[kind]) return;
      this.missions.cancel();
      this.kind = kind;
      this.version++;
      this.op++;
      this.navigatedOnce = false;
      this.phase = "idle";
      this.message = this.isClaimed(kind) ? TEXT.claimed : this["native"] ? TEXT["intro_" + kind] : TEXT.preview;
      this._render();
      !this.isClaimed(kind) && this["native"] && this.check();
    };
    MissionFlow.prototype.start = function() {
      if (!this.kind) return;
      if (this.isClaimed(this.kind)) {
        this.message = TEXT.claimed;
        this._render();
        return;
      }
      if ("opening" === this.phase || "checking" === this.phase) {
        this.message = TEXT.wait;
        this._render();
        return;
      }
      var self = this, op = ++this.op, isCurrent = this._guard();
      this.phase = "opening";
      this.message = TEXT.opening;
      this._render();
      return this.missions.navigate(this.kind, {
        isCurrent: isCurrent
      }).then(function(r) {
        if (!isCurrent() || op !== self.op) return;
        self.phase = "idle";
        if ("success" === r.status) {
          self.navigatedOnce = true;
          self.message = TEXT.navigated;
        } else self.message = "unsupported" !== r.status || self["native"] ? r.message : TEXT.preview;
        self._render();
      });
    };
    MissionFlow.prototype.check = function() {
      if (!this.kind) return;
      if (this.isClaimed(this.kind)) {
        this.message = TEXT.claimed;
        this._render();
        return;
      }
      if ("checking" === this.phase) return this.pendingCheck;
      if ("opening" === this.phase) {
        this.message = TEXT.wait;
        this._render();
        return;
      }
      var self = this, op = ++this.op, isCurrent = this._guard(), kind = this.kind;
      this.phase = "checking";
      this.message = TEXT.checking;
      this._render();
      this.pendingCheck = this.missions.query(kind, {
        isCurrent: isCurrent
      }).then(function(r) {
        if (!isCurrent() || op !== self.op) return;
        self.pendingCheck = null;
        if (r.eligible) {
          self._grant(kind);
          return;
        }
        self.phase = "idle";
        self.message = "unsupported" !== r.status || self["native"] ? r.message : TEXT.preview;
        self._render();
      });
      return this.pendingCheck;
    };
    MissionFlow.prototype._grant = function(kind) {
      var self = this;
      var result = this.store.update(function(draft) {
        if (true === draft.platformClaims[kind]) return false;
        draft.platformClaims[kind] = true;
        return self.reward(kind, draft);
      });
      if (result.ok) {
        this.phase = "done";
        this.message = TEXT.granted + (this.rewardText[kind] || "");
        this._render();
        if (this.onGranted) try {
          this.onGranted(kind, result.data);
        } catch (_) {}
        return;
      }
      this.phase = "idle";
      this.message = this.isClaimed(kind) ? TEXT.claimed : TEXT.saveFailed;
      this._render();
    };
    MissionFlow.prototype.close = function() {
      this.missions.cancel();
      this.kind = null;
      this.version++;
      this.op++;
      this.phase = "closed";
      this.message = "";
      this.pendingCheck = null;
      this._render();
    };
    MissionFlow.prototype.onShow = function() {
      this.missions.onResume();
      this.version++;
      this.op++;
      this.pendingCheck = null;
      if (!this.kind) return;
      this.phase = "idle";
      if (this.isClaimed(this.kind)) {
        this.message = TEXT.claimed;
        this._render();
        return;
      }
      this.navigatedOnce = true;
      this.check();
    };
    MissionFlow.prototype.tick = function() {
      this.missions.tick();
    };
    MissionFlow.prototype.dispose = function() {
      this.close();
      this.ownsMissions && this.missions.dispose();
    };
    MissionFlow.TEXT = TEXT;
    module.exports = MissionFlow;
    cc._RF.pop();
  }, {
    "./PlatformConfig": "PlatformConfig",
    "./TikTokMissionService": "TikTokMissionService"
  } ],
  PlatformConfig: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "8bd2d36xaZEUpordxU4m8OM", "PlatformConfig");
    "use strict";
    var config = {
      kitVersion: 2,
      gameId: "sables-stack-shot",
      appId: "7683427172773644296",
      clientKey: "mgq7o8c3rbhdx2kv",
      normalLevelCoins: 48,
      rewardedPlacements: [ {
        name: "Rewarded 2",
        id: "ad7683064432721709074"
      }, {
        name: "Rewarded",
        id: "ad7683076047361067016"
      }, {
        name: "Rewarded",
        id: "ad7683199506230233095"
      } ],
      placementMap: {
        revive: 0,
        hint: 0,
        pin: 0,
        start_boost: 0,
        skin: 1,
        trial: 1,
        background: 1,
        double_coins: 2,
        result: 2,
        gift: 2
      }
    };
    config.getAdUnitId = function(key) {
      var index = config.placementMap[key];
      return "number" === typeof index && config.rewardedPlacements[index] ? config.rewardedPlacements[index].id : "";
    };
    config.saveKey = function() {
      return config.gameId + ":" + config.appId + ":save:v1";
    };
    config.GROWTH_REWARD_B = 5;
    config.growthReward = function() {
      var b = config.normalLevelCoins;
      if ("number" !== typeof b || !(b > 0) || Math.floor(b) !== b) throw new Error("PlatformConfig.js: set normalLevelCoins to B (unlock_table.json normal_level_coins)");
      return config.GROWTH_REWARD_B * b;
    };
    module.exports = config;
    cc._RF.pop();
  }, {} ],
  Platform: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "567d8DdpOBLKaiWr0fLyJBr", "Platform");
    "use strict";
    var RewardedService = require("../tiktok-platform/RewardedService"), config = require("../tiktok-platform/PlatformConfig");
    function now() {
      return "undefined" !== typeof performance && performance.now ? performance.now() : Date.now();
    }
    function Platform() {
      this.ads = new RewardedService({
        autoPoll: false
      });
    }
    Platform.prototype.available = function(role) {
      return !!this.ads.getSDK("createRewardedVideoAd") && !!config.getAdUnitId(role);
    };
    Platform.prototype.request = function(role, owner, done) {
      return this.ads.request({
        placementKey: role,
        ownerId: owner
      }).then(function(r) {
        done(r.rewarded, r.message);
        return r;
      });
    };
    Platform.prototype.pause = function() {
      this.ads.onHide();
    };
    Platform.prototype.resume = function() {
      this.ads.onShow();
    };
    Platform.prototype.update = function() {
      this.ads.tick();
    };
    Platform.prototype.cancel = function(owner) {
      this.ads.cancelOwner(owner);
    };
    Platform.prototype.dispose = function() {
      this.ads.dispose();
    };
    Platform.now = now;
    module.exports = Platform;
    cc._RF.pop();
  }, {
    "../tiktok-platform/PlatformConfig": "PlatformConfig",
    "../tiktok-platform/RewardedService": "RewardedService"
  } ],
  RewardedService: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "cda0ctVMxFKk4QvS1tiKwcG", "RewardedService");
    "use strict";
    var config = require("./PlatformConfig");
    var nativeSession = null;
    var sequence = 0;
    var messages = {
      completed: "Reward ready.",
      cancelled: "Video closed. No reward was claimed.",
      error: "The video could not open. Please try again.",
      timeout: "The video took too long to start. Please try again.",
      unsupported: "Rewarded videos are available inside TikTok.",
      busy: "A video is still active. Please finish or close it first.",
      stale: "This session has ended. No reward was claimed.",
      unconfigured: "This reward is not available."
    };
    function rootSDK(method) {
      var candidates = [ "undefined" !== typeof TTMinis && TTMinis.game, "undefined" !== typeof tt && tt, "undefined" !== typeof wx && wx ];
      for (var i = 0; i < candidates.length; i++) {
        var candidate = candidates[i];
        if (!candidate || "function" !== typeof candidate[method]) continue;
        try {
          if ("function" === typeof candidate.canIUse && !candidate.canIUse(method)) continue;
          return candidate;
        } catch (_) {}
      }
      return null;
    }
    function current(o) {
      try {
        return !o.isCurrent || true === o.isCurrent();
      } catch (_) {
        return false;
      }
    }
    function errorCode(e) {
      return !e || "number" !== typeof e.errorCode && "string" !== typeof e.errorCode ? null : e.errorCode;
    }
    function safely(fn) {
      try {
        fn();
      } catch (_) {}
    }
    function makeResult(status, session, error, reason) {
      return {
        status: status,
        rewarded: "completed" === status,
        message: messages[status],
        phase: session ? session.phase : "request",
        requestId: session ? session.id : null,
        placementKey: session ? session.options.placementKey : null,
        errorCode: errorCode(error),
        reason: reason || null
      };
    }
    function RewardedService(options) {
      options = options || {};
      this.getSDK = options.getSDK || rootSDK;
      this.now = options.now || Date.now;
      this.requestTimeoutMs = options.requestTimeoutMs || 15e3;
      this.exitAfterMs = options.exitAfterMs || 3e4;
      this.pending = null;
      var self = this;
      this.poll = false === options.autoPoll ? null : setInterval(function() {
        self.tick();
      }, 100);
      this.poll && this.poll.unref && this.poll.unref();
    }
    RewardedService.prototype.tick = function() {
      var s = this.pending;
      if (!s || s.terminal) return;
      if (!current(s.options)) return s.finish("stale");
      if ("request" === s.phase) null === s.hiddenAt && this.now() >= s.deadline && s.finish("timeout"); else if (!s.exitNotified && this.exitAvailable()) {
        s.exitNotified = true;
        "function" === typeof s.options.onExitAvailable && safely(function() {
          s.options.onExitAvailable();
        });
      }
    };
    RewardedService.prototype.onHide = function() {
      var s = this.pending;
      s && null === s.hiddenAt && (s.hiddenAt = this.now());
    };
    RewardedService.prototype.onShow = function() {
      var s = this.pending;
      if (!s || null === s.hiddenAt) return;
      var away = Math.max(0, this.now() - s.hiddenAt);
      s.hiddenAt = null;
      "request" === s.phase && (s.deadline += away);
    };
    RewardedService.prototype.exitAvailable = function() {
      var s = this.pending;
      return !!(s && !s.terminal && "playing" === s.phase && this.now() >= s.exitAt);
    };
    RewardedService.prototype.exit = function() {
      this.pending && this.pending.finish("cancelled", null, "exit");
    };
    RewardedService.prototype.request = function(options) {
      options = options || {};
      this.tick();
      if (nativeSession) return Promise.resolve(makeResult("busy", null));
      var sdk;
      try {
        sdk = this.getSDK("createRewardedVideoAd");
      } catch (_) {}
      if (!sdk || "function" !== typeof sdk.createRewardedVideoAd) return Promise.resolve(makeResult("unsupported", null));
      try {
        if ("function" === typeof sdk.canIUse && !sdk.canIUse("createRewardedVideoAd")) return Promise.resolve(makeResult("unsupported", null));
      } catch (_) {
        return Promise.resolve(makeResult("unsupported", null));
      }
      var adUnitId = config.getAdUnitId(options.placementKey);
      if (!adUnitId) return Promise.resolve(makeResult("unconfigured", null));
      if (!current(options)) return Promise.resolve(makeResult("stale", null));
      var self = this;
      return new Promise(function(resolve) {
        var s = {
          id: ++sequence,
          options: options,
          phase: "request",
          ad: null,
          hiddenAt: null,
          deadline: self.now() + self.requestTimeoutMs,
          exitAt: Infinity,
          exitNotified: false,
          terminal: false
        };
        self.pending = s;
        nativeSession = s;
        function onClose(res) {
          s.finish(res && true === res.isEnded ? "completed" : "cancelled");
        }
        function onError(e) {
          s.finish("error", e);
        }
        function onHide() {
          self.onHide();
        }
        function onShow() {
          self.onShow();
        }
        s.finish = function(status, error, reason) {
          if (s.terminal) return;
          s.terminal = true;
          self.pending === s && (self.pending = null);
          nativeSession === s && (nativeSession = null);
          if (s.ad) {
            "function" === typeof s.ad.offClose && safely(function() {
              s.ad.offClose(onClose);
            });
            "function" === typeof s.ad.offError && safely(function() {
              s.ad.offError(onError);
            });
          }
          "function" === typeof sdk.offHide && safely(function() {
            sdk.offHide(onHide);
          });
          "function" === typeof sdk.offShow && safely(function() {
            sdk.offShow(onShow);
          });
          resolve(makeResult(current(options) ? status : "stale", s, error, reason));
        };
        try {
          "function" === typeof sdk.onHide && sdk.onHide(onHide);
          "function" === typeof sdk.onShow && sdk.onShow(onShow);
          s.ad = sdk.createRewardedVideoAd({
            adUnitId: adUnitId
          });
          if (!s.ad || "function" !== typeof s.ad.onClose || "function" !== typeof s.ad.onError || "function" !== typeof s.ad.show) {
            s.finish("unsupported");
            return;
          }
          s.ad.onClose(onClose);
          s.ad.onError(onError);
          if (s.terminal) return;
          var shown = s.ad.show();
          if (shown && "function" === typeof shown.then) shown.then(function() {
            if (s.terminal) return;
            s.phase = "playing";
            s.exitAt = self.now() + self.exitAfterMs;
          }, function(e) {
            s.finish("error", e);
          }); else {
            s.phase = "playing";
            s.exitAt = self.now() + self.exitAfterMs;
          }
        } catch (e) {
          s.finish("error", e);
        }
      });
    };
    RewardedService.prototype.cancelOwner = function(ownerId) {
      this.pending && this.pending.options.ownerId === ownerId && this.pending.finish("cancelled", null, "owner");
    };
    RewardedService.prototype.isNativeBusy = function() {
      return null !== nativeSession;
    };
    RewardedService.prototype.dispose = function() {
      this.pending && this.pending.finish("stale");
      null !== this.poll && clearInterval(this.poll);
      this.poll = null;
    };
    module.exports = RewardedService;
    cc._RF.pop();
  }, {
    "./PlatformConfig": "PlatformConfig"
  } ],
  Rules: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "3ae10On4mZHSYYRRVOyGK0R", "Rules");
    "use strict";
    function initial(level) {
      return {
        cols: (level.columns || [ [], [], [], [], [] ]).map(function(c) {
          return c.slice();
        }),
        queue: level.queue.slice(),
        qi: 0,
        goal: level.goal,
        target: level.target,
        score: 0,
        bank: 0,
        pin: !!level.pin,
        pinTapped: false,
        pinSafe: false,
        helped: false,
        recipe: level.recipe,
        orders: level.orders || null,
        gold: level.gold,
        lastColumn: -1,
        switches: 0,
        shots: 0,
        echo: !!level.echo,
        echoed: false,
        bankRule: !!level.bank_rule,
        merge: !!level.merge,
        inkDouble: !!level.ink_double,
        inked: false,
        lost: false,
        mergedNow: false,
        bankedNow: false,
        cashedNow: false,
        nibs: 0
      };
    }
    function empty(s) {
      return s.cols.every(function(c) {
        return 0 === c.length;
      });
    }
    function recipe(s) {
      return s.orders ? s.orders[s.qi] : s.recipe;
    }
    function accepts(s, c) {
      var r = recipe(s);
      return Number.isInteger(c) && c >= 0 && c < 5 && (null == r || r === c) && s.cols[c].length < 6;
    }
    function win(s) {
      return !s.lost && s.qi === s.queue.length && empty(s) && 0 === s.bank && s.score >= s.target;
    }
    function lose(s) {
      if (s.lost) return true;
      if (s.qi === s.queue.length) return !empty(s) || s.bank > 0 || s.score < s.target;
      return ![ 0, 1, 2, 3, 4 ].some(function(c) {
        return accepts(s, c);
      });
    }
    function apply(s, move) {
      if (win(s) || lose(s)) return false;
      var kind = move[0];
      if ("pin" === kind) {
        if (!s.pin || s.pinTapped) return false;
        s.pinTapped = true;
        s.pinSafe ? s.pinSafe = false : s.lost = true;
        return true;
      }
      if ("help" === kind) {
        if (!s.pin || s.pinTapped || s.helped || s.queue.length - s.qi !== 1) return false;
        s.helped = true;
        s.pinSafe = true;
        return true;
      }
      if ("shot" !== kind || !accepts(s, move[1])) return false;
      s.mergedNow = false;
      s.bankedNow = false;
      s.cashedNow = false;
      -1 !== s.lastColumn && s.lastColumn !== move[1] && s.switches++;
      s.lastColumn = move[1];
      s.shots++;
      var stack = s.cols[move[1]];
      stack.push(s.queue[s.qi++]);
      if (s.merge) while (stack.length >= 2 && stack[stack.length - 1] === stack[stack.length - 2]) {
        var a = stack.pop();
        stack.pop();
        stack.push(2 * a);
        s.mergedNow = true;
      }
      if (s.mergedNow && s.echo && !s.echoed) {
        s.score += 45;
        s.echoed = true;
      }
      var top = stack[stack.length - 1];
      s.mergedNow && top >= 4 && s.nibs++;
      if (s.mergedNow && s.bankRule && top >= 4) {
        s.bank += top;
        s.bankedNow = true;
        top >= s.goal && stack.pop();
      } else if (s.mergedNow && s.bankRule && 2 === top && s.bank > 0) {
        s.score += s.bank;
        s.bank = 0;
        s.cashedNow = true;
        stack.pop();
      } else if (top >= s.goal) {
        var add = top;
        if (!s.mergedNow && s.inkDouble && !s.inked) {
          add *= 2;
          s.inked = true;
        }
        s.score += add;
        stack.pop();
      }
      return true;
    }
    module.exports = {
      initial: initial,
      apply: apply,
      win: win,
      lose: lose,
      recipe: recipe,
      accepts: accepts
    };
    cc._RF.pop();
  }, {} ],
  SaveStore: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "697b7DU5FBOyZVsf6yRnazs", "SaveStore");
    "use strict";
    var config = require("./PlatformConfig");
    function clone(value) {
      return JSON.parse(JSON.stringify(value));
    }
    function isRecord(value) {
      return !!value && "object" === typeof value && !Array.isArray(value);
    }
    function defaultStorage() {
      return "undefined" !== typeof cc && cc.sys && cc.sys.localStorage ? cc.sys.localStorage : null;
    }
    function defaultStorageKeys() {
      var candidates = [ "undefined" !== typeof TTMinis && TTMinis && TTMinis.game, "undefined" !== typeof tt && tt, "undefined" !== typeof wx && wx ];
      for (var i = 0; i < candidates.length; i++) {
        var c = candidates[i];
        if (!c || "function" !== typeof c.getStorageInfoSync) continue;
        try {
          var info = c.getStorageInfoSync();
          if (info && Array.isArray(info.keys)) return info.keys;
        } catch (_) {}
      }
      return null;
    }
    function isUnreadable(raw) {
      return void 0 === raw || true === raw || false === raw;
    }
    var loginSent = false;
    function noop() {}
    function defaultLogin() {
      if (loginSent) return false;
      var candidates = [ "undefined" !== typeof TTMinis && TTMinis && TTMinis.game, "undefined" !== typeof tt && tt, "undefined" !== typeof wx && wx ];
      for (var i = 0; i < candidates.length; i++) {
        var c = candidates[i];
        if (!c || "function" !== typeof c.login) continue;
        loginSent = true;
        try {
          var r = c.login({
            success: noop,
            fail: noop,
            complete: noop
          });
          r && "function" === typeof r.then && r.then(noop, noop);
        } catch (_) {}
        return true;
      }
      return false;
    }
    function SaveStore(defaults, options) {
      options = options || {};
      this.key = options.key || config.saveKey();
      this.storage = options.storage || defaultStorage();
      this.storageKeys = options.storageKeys || defaultStorageKeys;
      this.login = false === options.login ? noop : "function" === typeof options.login ? options.login : defaultLogin;
      this.loginTried = false;
      this.now = options.now || Date.now;
      this.defaults = clone(isRecord(defaults) ? defaults : {});
      isRecord(this.defaults.platformClaims) || (this.defaults.platformClaims = {
        shortcut: false,
        profile: false
      });
      isRecord(this.defaults.meta) || (this.defaults.meta = {});
      this.data = null;
      this.status = "unloaded";
    }
    SaveStore.prototype._fill = function(data) {
      var self = this;
      Object.keys(this.defaults).forEach(function(k) {
        void 0 === data[k] && (data[k] = clone(self.defaults[k]));
      });
      isRecord(data.platformClaims) || (data.platformClaims = {
        shortcut: false,
        profile: false
      });
      isRecord(data.meta) || (data.meta = {});
      return data;
    };
    SaveStore.prototype.load = function() {
      var result = this._load();
      this._loginOnce();
      return result;
    };
    SaveStore.prototype._loginOnce = function() {
      if (this.loginTried) return;
      this.loginTried = true;
      var login = this.login;
      function send() {
        try {
          login();
        } catch (_) {}
      }
      try {
        "function" === typeof setTimeout ? setTimeout(send, 0) : send();
      } catch (_) {}
    };
    SaveStore.prototype._load = function() {
      if (!this.storage) {
        this.data = clone(this.defaults);
        this.status = "unavailable";
        return this._result(false, "storage_unavailable");
      }
      var raw = null, threw = false;
      try {
        raw = this.storage.getItem(this.key);
      } catch (_) {
        threw = true;
      }
      if (threw || isUnreadable(raw)) {
        var keys = null;
        try {
          keys = this.storageKeys();
        } catch (_) {
          keys = null;
        }
        var known = Array.isArray(keys);
        if (known && keys.indexOf(this.key) < 0) return this._fresh();
        if (threw) {
          this.data = clone(this.defaults);
          this.status = "unavailable";
          return this._result(false, "read_failed");
        }
        if (void 0 === raw && !known) {
          this.data = clone(this.defaults);
          this.status = "new";
          return this._result(true);
        }
        return this._recover(raw);
      }
      if (null === raw || "" === raw) {
        this.data = clone(this.defaults);
        this.status = "new";
        return this._result(true);
      }
      var parsed = null;
      try {
        parsed = "string" === typeof raw ? JSON.parse(raw) : raw;
      } catch (_) {
        parsed = null;
      }
      if (!isRecord(parsed)) return this._recover(raw);
      this.data = this._fill(parsed);
      this.status = "loaded";
      return this._result(true);
    };
    SaveStore.prototype._fresh = function() {
      this.data = clone(this.defaults);
      this.status = "new";
      var written = this._write(this.data);
      return this._result(true, written);
    };
    SaveStore.prototype._recover = function(raw) {
      try {
        this.storage.setItem(this.key + ":corrupt-backup", "string" === typeof raw ? raw : String(raw));
      } catch (_) {}
      var fresh = clone(this.defaults);
      fresh.meta.recoveredFromCorrupt = this.now();
      this.data = fresh;
      this.status = "recovered";
      var written = this._write(fresh);
      return this._result(null === written, written);
    };
    SaveStore.prototype._write = function(draft) {
      var text;
      try {
        text = JSON.stringify(draft);
      } catch (_) {
        return "serialize_failed";
      }
      var previous = null;
      try {
        previous = this.storage.getItem(this.key);
      } catch (_) {}
      try {
        this.storage.setItem(this.key, text);
      } catch (_) {
        return "write_failed";
      }
      var back;
      try {
        back = this.storage.getItem(this.key);
      } catch (_) {
        back = null;
      }
      if (back === text) return null;
      try {
        "string" === typeof previous && this.storage.setItem(this.key, previous);
      } catch (_) {}
      return "readback_mismatch";
    };
    SaveStore.prototype._result = function(ok, error) {
      return {
        ok: ok,
        status: this.status,
        error: error || null,
        data: this.data ? clone(this.data) : null
      };
    };
    SaveStore.prototype.get = function() {
      "unloaded" === this.status && this.load();
      return clone(this.data);
    };
    SaveStore.prototype.update = function(mutator) {
      "unloaded" === this.status && this.load();
      if (!this.storage) return this._result(false, "storage_unavailable");
      var draft = clone(this.data);
      var answer;
      try {
        answer = mutator(draft);
      } catch (_) {
        return this._result(false, "mutator_threw");
      }
      if (false === answer) return this._result(false, "cancelled");
      if (!isRecord(draft)) return this._result(false, "invalid_draft");
      var error = this._write(draft);
      if (error) return this._result(false, error);
      this.data = draft;
      "new" !== this.status && "unavailable" !== this.status || (this.status = "loaded");
      return this._result(true);
    };
    SaveStore.prototype.isClaimed = function(kind) {
      "unloaded" === this.status && this.load();
      if (this.data.meta && this.data.meta.recoveredFromCorrupt) return true;
      return true === this.data.platformClaims[kind];
    };
    SaveStore._resetLoginForTests = function() {
      loginSent = false;
    };
    module.exports = SaveStore;
    cc._RF.pop();
  }, {
    "./PlatformConfig": "PlatformConfig"
  } ],
  Store: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "6589c6cPLxHP5h/xiXz9Tto", "Store");
    "use strict";
    var SaveStore = require("../tiktok-platform/SaveStore");
    var KEY = "SablesStackShot:save:v2";
    function fresh() {
      return {
        version: 2,
        sparks: 0,
        nibs: 0,
        cleared: 0,
        stars: {},
        owned: [ "hero_01", "bg_01" ],
        hero: "hero_01",
        background: "bg_01",
        gift: {
          charges: 1
        },
        serial: 0,
        pending: null,
        settings: {
          music: true,
          sfx: true,
          vibration: true,
          musicVolume: 7,
          sfxVolume: 7
        },
        tryGate: 0,
        trial: null,
        checkin: null,
        platformClaims: {
          shortcut: false,
          profile: false
        },
        meta: {}
      };
    }
    function integer(v, lo, hi, fallback) {
      return "number" === typeof v && isFinite(v) ? Math.max(lo, Math.min(hi, Math.floor(v))) : fallback;
    }
    function clean(input, table) {
      var d = fresh(), s = input && "object" === typeof input ? input : {};
      d.sparks = integer(s.sparks, 0, 99999, 0);
      d.nibs = integer(s.nibs, 0, 99, 0);
      d.cleared = integer(s.cleared, 0, 70, 0);
      d.serial = integer(s.serial, 0, 1e9, 0);
      d.tryGate = integer(s.tryGate, 0, 70, 0);
      for (var i = 1; i <= d.cleared; i++) s.stars && (d.stars[i] = integer(s.stars[i], 0, 3, 0));
      var items = table.items;
      d.owned = items.filter(function(it) {
        return "free" === it.unlock || Array.isArray(s.owned) && s.owned.indexOf(it.id) >= 0;
      }).map(function(it) {
        return it.id;
      });
      [ "hero", "background" ].forEach(function(k) {
        var group = "hero" === k ? "skin" : "background";
        items.some(function(it) {
          return it.id === s[k] && it.group === group && d.owned.indexOf(it.id) >= 0;
        }) && (d[k] = s[k]);
      });
      d.gift = s.gift && 3 === s.gift.version ? {
        version: 3,
        nextClaimAt: integer(s.gift.nextClaimAt, 0, 9e15, 0),
        lastClaimAt: integer(s.gift.lastClaimAt, 0, 9e15, 0)
      } : {
        charges: s.gift && 0 === s.gift.charges ? 0 : 1
      };
      s.checkin && 1 === s.checkin.v && (d.checkin = {
        v: 1,
        claimed: integer(s.checkin.claimed, 0, 6, 0),
        cycle: integer(s.checkin.cycle, 0, 1e9, 0),
        last_day: Number.isSafeInteger(s.checkin.last_day) ? s.checkin.last_day : null,
        total: integer(s.checkin.total, 0, 1e9, 0),
        created: integer(s.checkin.created, 0, 1e9, 0)
      });
      var t = s.settings || {};
      [ "music", "sfx", "vibration" ].forEach(function(k) {
        "boolean" === typeof t[k] && (d.settings[k] = t[k]);
      });
      [ "musicVolume", "sfxVolume" ].forEach(function(k) {
        d.settings[k] = integer(t[k], 0, 10, 7);
      });
      s.pending && Number.isInteger(s.pending.level) && s.pending.level >= 1 && s.pending.level <= 70 && s.pending.id === s.serial && s.pending.level <= d.cleared && Number.isInteger(s.pending.total) && s.pending.total >= 0 && s.pending.total < 99999 && (d.pending = {
        id: s.pending.id,
        level: s.pending.level,
        total: s.pending.total,
        stars: integer(s.pending.stars, 1, 3, 1),
        doubled: true === s.pending.doubled,
        bonus: integer(s.pending.bonus, 0, 99999, 0)
      });
      s.trial && Number.isInteger(s.trial.level) && s.trial.level >= 1 && s.trial.level <= 70 && items.some(function(it) {
        return it.id === s.trial.id && "skin" === it.group && "coins" === it.unlock;
      }) && (d.trial = {
        id: s.trial.id,
        level: s.trial.level
      });
      d.platformClaims = {
        shortcut: !!(s.platformClaims && s.platformClaims.shortcut),
        profile: !!(s.platformClaims && s.platformClaims.profile)
      };
      d.meta = s.meta && "object" === typeof s.meta ? s.meta : {};
      return d;
    }
    function Store(storage, table) {
      this.storage = storage;
      this.table = table;
      this.warning = "";
      this.backend = new SaveStore(fresh(), {
        key: KEY,
        storage: storage
      });
      var result = this.backend.load();
      this.data = clean(result.data, table);
      this.backend.data = this.data;
      "recovered" === result.status ? this.warning = "Saved data was damaged. The original was backed up." : result.ok || (this.warning = "Saved data could not be read. Retry saving to keep progress.");
    }
    Store.prototype.commit = function(change) {
      this.backend.storage = this.storage;
      var self = this, failure = null, result = this.backend.update(function(draft) {
        try {
          change(draft);
        } catch (e) {
          failure = e;
          throw e;
        }
        var next = clean(draft, self.table);
        Object.keys(draft).forEach(function(k) {
          delete draft[k];
        });
        Object.assign(draft, next);
      });
      if (!result.ok) throw failure || new Error(result.error || "Save verification failed");
      this.data = result.data;
      return this.data;
    };
    Store.prototype.get = function() {
      return JSON.parse(JSON.stringify(this.data));
    };
    Store.prototype.update = function(change) {
      try {
        this.commit(change);
        return {
          ok: true,
          data: this.get()
        };
      } catch (e) {
        return {
          ok: false,
          error: e.message,
          data: this.get()
        };
      }
    };
    Store.prototype.isClaimed = function(kind) {
      return !!this.data.meta.recoveredFromCorrupt || true === this.data.platformClaims[kind];
    };
    Store.prototype.clear = function(level, stars, reward, nibs, milestone) {
      if (this.data.pending) return this.data.pending;
      this.commit(function(s) {
        var first = level > s.cleared;
        s.serial++;
        s.trial && s.trial.level === level && (s.trial = null);
        s.cleared = Math.max(s.cleared, level);
        s.stars[level] = Math.max(s.stars[level] || 0, stars);
        s.sparks = Math.min(99999, s.sparks + reward + (first ? milestone : 0));
        s.nibs = Math.min(99, s.nibs + nibs);
        s.pending = {
          id: s.serial,
          level: level,
          total: reward + (first ? milestone : 0),
          stars: stars,
          doubled: false,
          bonus: first ? milestone : 0
        };
      });
      return this.data.pending;
    };
    Store.prototype["double"] = function(id) {
      this.commit(function(s) {
        if (!s.pending || s.pending.id !== id || s.pending.doubled) return;
        s.sparks = Math.min(99999, s.sparks + s.pending.total);
        s.pending.doubled = true;
      });
    };
    Store.prototype.buy = function(id) {
      var item = this.table.items.find(function(i) {
        return i.id === id;
      });
      if (!item) throw new Error("Unknown item");
      this.commit(function(s) {
        if (s.owned.indexOf(id) < 0) {
          if ("coins" !== item.unlock || s.sparks < item.coins) throw new Error("Not enough Sparks");
          s.sparks -= item.coins;
          s.owned.push(id);
        }
        s["skin" === item.group ? "hero" : "background"] = id;
      });
    };
    Store.KEY = KEY;
    Store.clean = clean;
    Store.fresh = fresh;
    module.exports = Store;
    cc._RF.pop();
  }, {
    "../tiktok-platform/SaveStore": "SaveStore"
  } ],
  TikTokMissionService: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "4eb1a5HzXJF/psNsfBoI0Nv", "TikTokMissionService");
    "use strict";
    var methods = {
      shortcut: {
        navigate: "addShortcut",
        query: "getShortcutMissionReward"
      },
      profile: {
        navigate: "startEntranceMission",
        query: "getEntranceMissionReward"
      }
    };
    var messages = {
      success: "Return through this TikTok entry, then check your reward.",
      eligible: "Your reward is ready to claim.",
      ineligible: "Open this game from the TikTok entry, then check again.",
      unsupported: "This feature is available inside a supported TikTok app.",
      error: "The request failed. Please try again.",
      timeout: "The check took too long. Please try again.",
      invalid: "No reward information was returned. Please try again.",
      cancelled: "The check ended. Please try again.",
      stale: "This check has ended. Please check again."
    };
    function sdk(method) {
      var candidates = [ "undefined" !== typeof TTMinis && TTMinis.game, "undefined" !== typeof tt && tt, "undefined" !== typeof wx && wx ];
      for (var i = 0; i < candidates.length; i++) {
        var candidate = candidates[i];
        if (!candidate || "function" !== typeof candidate[method] || "function" !== typeof candidate.canIUse) continue;
        try {
          if (candidate.canIUse(method)) return candidate;
        } catch (_) {}
      }
      return null;
    }
    function isCurrent(options) {
      try {
        return !options.isCurrent || true === options.isCurrent();
      } catch (_) {
        return false;
      }
    }
    function result(status, request, e) {
      return {
        status: status,
        eligible: "eligible" === status,
        rewarded: false,
        message: messages[status],
        requestId: request ? request.id : null,
        kind: request ? request.kind : null,
        api: request ? request.method : null,
        errorCode: e && void 0 !== e.errorCode ? e.errorCode : null
      };
    }
    function TikTokMissionService(options) {
      options = options || {};
      this.getSDK = options.getSDK || sdk;
      this.now = options.now || Date.now;
      this.timeoutMs = options.timeoutMs || 1e4;
      this.pending = {};
      this.epoch = 0;
      this.sequence = 0;
      var self = this;
      this.poll = false === options.autoPoll ? null : setInterval(function() {
        self.tick();
      }, 100);
      this.poll && this.poll.unref && this.poll.unref();
    }
    TikTokMissionService.prototype.tick = function() {
      var self = this;
      Object.keys(this.pending).forEach(function(key) {
        var r = self.pending[key];
        isCurrent(r.options) ? self.now() >= r.deadline ? r.settle("timeout") : null !== r.emptyAt && self.now() >= r.emptyAt && r.settle("invalid") : r.settle("stale");
      });
    };
    TikTokMissionService.prototype._call = function(kind, action, options) {
      options = options || {};
      this.tick();
      var method = methods[kind] && methods[kind][action];
      if (!method) return Promise.resolve(result("unsupported", null));
      var key = kind + ":" + action;
      if (this.pending[key]) return this.pending[key].promise;
      var api;
      try {
        api = this.getSDK(method);
      } catch (_) {}
      try {
        if (!api || "function" !== typeof api[method] || "function" !== typeof api.canIUse || !api.canIUse(method)) return Promise.resolve(result("unsupported", null));
      } catch (_) {
        return Promise.resolve(result("unsupported", null));
      }
      if (!isCurrent(options)) return Promise.resolve(result("stale", null));
      var self = this;
      var resolve;
      var promise = new Promise(function(done) {
        resolve = done;
      });
      var r = {
        id: ++this.sequence,
        kind: kind,
        method: method,
        action: action,
        options: options,
        epoch: this.epoch,
        deadline: this.now() + this.timeoutMs,
        emptyAt: null,
        settled: false,
        promise: promise
      };
      r.settle = function(status, error) {
        if (r.settled) return;
        r.settled = true;
        self.pending[key] === r && delete self.pending[key];
        resolve(result(r.epoch === self.epoch && isCurrent(options) ? status : "stale", r, error));
      };
      this.pending[key] = r;
      function empty() {
        if (r.settled) return;
        null === r.emptyAt && (r.emptyAt = Math.min(r.deadline, self.now() + 100));
      }
      function success(value) {
        if (r.settled) return;
        if ("navigate" === action) return r.settle("success");
        value && true === value.canReceiveReward ? r.settle("eligible") : value && false === value.canReceiveReward ? r.settle("ineligible") : empty();
      }
      function fail(error) {
        r.settle("error", error);
      }
      try {
        var returned = api[method]({
          success: success,
          fail: fail,
          complete: empty
        });
        returned && "function" === typeof returned.then && returned.then(success, fail);
      } catch (error) {
        fail(error);
      }
      return promise;
    };
    TikTokMissionService.prototype.navigate = function(kind, options) {
      return this._call(kind, "navigate", options);
    };
    TikTokMissionService.prototype.query = function(kind, options) {
      return this._call(kind, "query", options);
    };
    TikTokMissionService.prototype.cancel = function() {
      this.epoch++;
      var self = this;
      Object.keys(this.pending).forEach(function(key) {
        self.pending[key].settle("cancelled");
      });
    };
    TikTokMissionService.prototype.onResume = function() {
      this.cancel();
    };
    TikTokMissionService.prototype.dispose = function() {
      this.cancel();
      null !== this.poll && clearInterval(this.poll);
      this.poll = null;
    };
    module.exports = TikTokMissionService;
    cc._RF.pop();
  }, {} ]
}, {}, [ "AdRewards", "Art", "ArtBundles", "ButtonTouch", "DailyCheckin", "Data", "Game", "Platform", "Rules", "Store", "GameAudioButton", "GameAudioConfig", "GameAudioManager", "HomeGrowthEntries", "MissionFlow", "PlatformConfig", "RewardedService", "SaveStore", "TikTokMissionService" ]);