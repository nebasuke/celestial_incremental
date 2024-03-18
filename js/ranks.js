﻿addLayer("r", {
    name: "Ranks", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "R", // This appears on the layer's node. Default is the id with the first letter capitalized
    row: 1,
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,

        //Ranks and Tiers and stuff
        rank: new Decimal(0),
        rankReq: new Decimal(10), //Points
        rankEffect: new Decimal(1),
        ranksToGet: new Decimal(0),
        tier: new Decimal(0),
        tierReq: new Decimal(3), //Ranks
        tierEffect: new Decimal(1),
        tiersToGet: new Decimal(0),
        tetr: new Decimal(0),
        tetrReq: new Decimal(2), //Tiers
        tetrEffect: new Decimal(1),
        tetrsToGet: new Decimal(0),
        
        //PENT
        pent: new Decimal(0),
        pentReq: new Decimal(1e28),
        pentEffect: new Decimal(1),
        pentToGet: new Decimal(0),
        pentPause: new Decimal(0),

        pentMilestone3Effect: new Decimal(1),
        pentMilestone30Effect: new Decimal(1),
        pentMilestone30Effect2: new Decimal(1),
    }
    },
    automate() {
    },
    nodeStyle() {
    },
    tooltip: "Ranks",
    color: "#eaf6f7",
    update(delta) {
        let onepersec = new Decimal(1)

        //Rank and Tier effects/costs

        let ranksGainPreS = player.points.div(10).pow(Decimal.div(20, 33)).floor()
        let ranksGainPostS = player.points.div(10).pow(0.25).floor()
        let ranksGainPostS2 = player.points.div(10).pow(Decimal.div(1, 10)).floor()

        player.r.rankEffect = player.r.rank.mul(0.25).add(1).pow(1.05)
        player.r.rankReq = layers.r.getRankReq().div(player.cb.uncommonPetEffects[3][0])
        if (player.points.gte(player.r.rankReq) && player.r.rank.add(player.r.ranksToGet).lte(20) && hasUpgrade("p", 14))
        {
            player.r.ranksToGet = ranksGainPreS.sub(player.r.rank)
        }
        if (player.points.gte(player.r.rankReq) && player.r.rank.add(player.r.ranksToGet).gt(20) && hasUpgrade("p", 14))
        {
            player.r.ranksToGet = ranksGainPostS.sub(player.r.rank).add(18)
        }
        if (player.points.gte(player.r.rankReq) && player.r.rank.add(player.r.ranksToGet).gt(100) && hasUpgrade("p", 14))
        {
            player.r.ranksToGet = ranksGainPostS2.sub(player.r.rank).add(98)
        }
        if (!hasUpgrade("p", 14)) player.r.ranksToGet = new Decimal(1)
        if (player.points.lt(player.r.rankReq) || player.r.ranksToGet.lt(0))
        {
            player.r.ranksToGet = new Decimal(0)
        } 
        if (hasUpgrade("p", 17))
        {
            player.r.rank = player.r.rank.add(player.r.ranksToGet)
        }

        let tiersGain = player.r.rank.div(3).pow(Decimal.div(10, 11)).floor()

        player.r.tierEffect = player.r.tier.mul(0.5).add(1).pow(1.1)
        player.r.tierReq = layers.r.getTierReq().div(player.cb.uncommonPetEffects[3][1])
        if (player.r.rank.gte(player.r.tierReq) && hasUpgrade("p", 14))
        {
             player.r.tiersToGet = tiersGain.sub(player.r.tier)
        }
        if (!hasUpgrade("p", 14)) player.r.tiersToGet = new Decimal(1)
        if (player.r.rank.lt(player.r.tierReq))
        {
            player.r.tiersToGet = new Decimal(0)
        }
        if (hasUpgrade("p", 18))
        {
            player.r.tier = player.r.tier.add(player.r.tiersToGet)
        }

        let tetrGain = player.r.tier.div(2).pow(Decimal.div(25, 27)).floor()

        player.r.tetrEffect = player.r.tetr.mul(0.75).add(1).pow(1.2)
        player.r.tetrReq = layers.r.getTetrReq().div(player.cb.uncommonPetEffects[3][2])
        if (player.r.tier.gte(player.r.tetr.add(player.r.tetrsToGet).add(1).mul(2).pow(1.08).floor().add(1)) && hasUpgrade("p", 14))
        {
            player.r.tetrsToGet = tetrGain.sub(player.r.tetr)
        }
        if (!hasUpgrade("p", 14)) player.r.tetrsToGet = new Decimal(1)
        if (player.r.tier.lt(player.r.tetrReq))
        {
            player.r.tetrsToGet = new Decimal(0)
        }
        if (hasUpgrade("p", 22))
        {
            player.r.tetr = player.r.tetr.add(player.r.tetrsToGet)
        }
        
        player.r.pentEffect = player.r.pent.add(1).pow(3)
        if (player.r.pent.lt(4)) player.r.pentReq = player.r.pent.add(1).pow(42.5).mul(1e28)
        if (player.r.pent.gte(4) && player.r.pent.lt(5)) player.r.pentReq = player.r.pent.add(1).pow(42.5).mul(1e28).tetrate(1.001)
        if (player.r.pent.gte(5)) player.r.pentReq = player.r.pent.add(1).pow(50).mul(1e32).tetrate(1.0015)
        if (player.r.pent.gte(30)) player.r.pentReq = player.r.pent.add(1).pow(60).mul(1e32).tetrate(1.0025)
        player.r.pentReq = player.r.pentReq.div(buyableEffect("g", 19))

        if (player.r.pentPause.gt(0)) {
            layers.r.pentReset();
        }
        player.r.pentPause = player.r.pentPause.sub(1)

        player.r.pentToGet = new Decimal(1)
        if (player.points.lt(player.r.pentReq))
        {
            player.r.pentToGet = new Decimal(0)
        }

        player.r.pentMilestone3Effect = player.g.grass.pow(0.3).add(1)

        player.r.pentMilestone30Effect = player.r.pent.pow(2).add(1)
        player.r.pentMilestone30Effect2 = player.r.pent.pow(1.2).add(1)
    },
    getRankReq()
    {
        if (player.r.rank.lte(20))
        {
            return player.r.rank.add(1).pow(1.65).mul(10)
        } else if (player.r.rank.gt(20) && player.r.rank.lt(100))
        {
            return (player.r.rank.sub(17)).pow(4).mul(10)
        }
        else if (player.r.rank.gt(100))
        {
            return (player.r.rank.sub(97)).pow(10).mul(10)
        }
    },
    getTierReq()
    {
        return player.r.tier.add(1).mul(3).pow(1.1).floor()
    },
    getTetrReq()
    {
        return player.r.tetr.add(1).mul(2).pow(1.08).floor().add(1)
    },
    rankReset() {
        player.points = new Decimal(0)
        player.r.ranksToGet = new Decimal(0)
    },
    tierReset() {
        player.points = new Decimal(0)
        player.r.rank = new Decimal(0)
        player.r.ranksToGet = new Decimal(0)
        player.r.tiersToGet = new Decimal(0)
    },
    tetrReset() {
        player.points = new Decimal(0)
        player.r.rank = new Decimal(0)
        player.r.tier = new Decimal(0)
        player.r.ranksToGet = new Decimal(0)
        player.r.tiersToGet = new Decimal(0)
        player.r.tetrsToGet = new Decimal(0)
    },
    pentReset() {
        player.points = new Decimal(0)
        player.r.rank = new Decimal(0)
        player.r.tier = new Decimal(0)
        player.r.tetr = new Decimal(0)
        player.r.ranksToGet = new Decimal(0)
        player.r.tiersToGet = new Decimal(0)
        player.r.tetrsToGet = new Decimal(0)
        player.r.pentToGet = new Decimal(0)

        player.r.factorUnlocks = [true, true, true, false, false, false, false, false]
        player.r.factorGain = new Decimal(1)

        player.r.factorPower = new Decimal(0)
        player.r.factorPowerEffect = new Decimal(1)
        player.r.factorPowerPerSecond = new Decimal(0)
        player.r.powerFactorUnlocks = [true, true, true, false, false, false, false, false]

        player.f.buyables[11] = new Decimal(0)
        player.f.buyables[12] = new Decimal(0)
        player.f.buyables[13] = new Decimal(0)
        player.f.buyables[14] = new Decimal(0)
        player.f.buyables[15] = new Decimal(0)
        player.f.buyables[16] = new Decimal(0)
        player.f.buyables[17] = new Decimal(0)
        player.f.buyables[18] = new Decimal(0)
        player.f.buyables[19] = new Decimal(0)
        player.f.buyables[21] = new Decimal(0)
        player.f.buyables[22] = new Decimal(0)
        player.f.buyables[23] = new Decimal(0)
        player.f.buyables[24] = new Decimal(0)
        player.f.buyables[25] = new Decimal(0)
        player.f.buyables[26] = new Decimal(0)
        player.f.buyables[27] = new Decimal(0)

        player.p.prestigePoints = new Decimal(0)
        for (let i = 0; i < player.p.upgrades.length; i++) {
            if (+player.p.upgrades[i] < 23) {
                player.p.upgrades.splice(i, 1);
                i--;
            }
        }

        player.t.buyables[11] = new Decimal(0)
        player.t.buyables[12] = new Decimal(0)
        player.t.buyables[13] = new Decimal(0)
        player.t.buyables[14] = new Decimal(0)
        player.t.buyables[15] = new Decimal(0)
        player.t.buyables[16] = new Decimal(0)

        player.f.factorPower = new Decimal(0)

        player.t.leaves = new Decimal(0)
        player.t.trees = new Decimal(0)
    },
    clickables: {
        1: {
            title() { return "<h2>Return" },
            canClick() { return true },
            unlocked() { return true },
            onClick() {
                player.tab = "i"
            },
            style: { width: '100px', "min-height": '50px' },
        },
        11: {
            title() { return "<h2>Reset celestial points, but rank up.<br>Req: " + format(player.r.rankReq) + " Points" },
            canClick() { return player.points.gte(player.r.rankReq) },
            unlocked() { return true },
            onClick() {
                player.r.rank = player.r.rank.add(player.r.ranksToGet)
                layers.r.rankReset()
            },
            style: { width: '400px', "min-height": '100px' },
        },
        12: {
            title() { return "<h2>Reset celestial points and ranks, but tier up.<br>Req: " + formatWhole(player.r.tierReq) + " Rank" },
            canClick() { return player.r.rank.gte(player.r.tierReq) },
            unlocked() { return true },
            onClick() {
                player.r.tier = player.r.tier.add(player.r.tiersToGet)
                layers.r.tierReset()
            },
            style: { width: '400px', "min-height": '100px' },
        },
        13: {
            title() { return "<h2>Reset celestial points ranks and tier, but tetr up.<br>Req: " + formatWhole(player.r.tetrReq) + " Tier" },
            canClick() { return player.r.tier.gte(player.r.tetrReq) },
            unlocked() { return hasUpgrade("i", 13) },
            onClick() {
                player.r.tetr = player.r.tetr.add(player.r.tetrsToGet)
                layers.r.tetrReset()
            },
            style: { width: '400px', "min-height": '100px' },
        },
        14: {
            title() { return "<h2>Reset all content before grass, but pent.<br>Req: " + formatWhole(player.r.pentReq) + " Points" },
            canClick() { return player.points.gte(player.r.pentReq) },
            unlocked() { return true },
            onClick() {
                player.r.pent = player.r.pent.add(player.r.pentToGet)
                player.r.pentPause = new Decimal(3)
            },
            style: { width: '400px', "min-height": '100px' },
        },
    },
    bars: {
    },
    upgrades: {
    },
    buyables: {
    },
    milestones: {
        11: {
            requirementDescription: "<h3>Pent 1",
            effectDescription: "Unlocks a new type of factor and grass upgrades.",
            done() { return player.r.pent.gte(1) },
            style: { width: '800px', "min-height": '75px' },
        },
        12: {
            requirementDescription: "<h3>Pent 2",
            effectDescription: "Autobuy tree buyables and unlocks grasshop.",
            done() { return player.r.pent.gte(2) },
            style: { width: '800px', "min-height": '75px' },
        },
        13: {
            requirementDescription: "<h3>Pent 3",
            effectDescription() { return "Autobuys grass buyables, and unlocks tree factor VI.<br>Boosts celestial points based on grass: Currenty: " + format(player.r.pentMilestone3Effect) + "x" },
            done() { return player.r.pent.gte(3) },
            style: { width: '800px', "min-height": '75px' },
        },
        14: {
            requirementDescription: "<h3>Pent 5",
            effectDescription() { return "Unlock mods (in trees)." },
            done() { return player.r.pent.gte(5) },
            style: { width: '800px', "min-height": '75px' },
        },
        15: {
            requirementDescription: "<h3>Pent 7",
            effectDescription() { return "Autobuy grass and prestige upgrades." },
            done() { return player.r.pent.gte(7) },
            style: { width: '800px', "min-height": '90px' },
            toggles: [
                ["p", "auto"], // Each toggle is defined by a layer and the data toggled for that layer
                ["g", "auto"]
            ],
        },
        16: {
            requirementDescription: "<h3>Pent 8",
            effectDescription() { return "Unlock tree factor VIII and autobuy tree and grass factors." },
            done() { return player.r.pent.gte(8) },
            style: { width: '800px', "min-height": '75px' },
        },
        17: {
            requirementDescription: "<h3>Pent 11",
            effectDescription() { return "Unlocks a new check back button." },
            done() { return player.r.pent.gte(11)},
            unlocked() { return hasUpgrade("i", 19)},
            style: { width: '800px', "min-height": '75px' },
        },
        18: {
            requirementDescription: "<h3>Pent 15",
            effectDescription() { return "Unlocks new grasshop studies." },
            done() { return player.r.pent.gte(15) },
            unlocked() { return hasUpgrade("i", 19)},
            style: { width: '800px', "min-height": '75px' },
        },
        19: {
            requirementDescription: "<h3>Pent 30",
            effectDescription() { return "Boosts tree and mod gain based on pent: Currenty: " + format(player.r.pentMilestone30Effect) + "x and " + format(player.r.pentMilestone30Effect2) + "x respectively." },
            done() { return player.r.pent.gte(30) },
            unlocked() { return hasUpgrade("i", 19) },
            style: { width: '800px', "min-height": '75px' },
        },
    },
    challenges: {
    },
    infoboxes: {
    },
    microtabs: {
        stuff: {
            "Main": {
                buttonStyle() { return { 'color': 'white' } },
                unlocked() { return true },
                content:
                [
                        ["blank", "25px"],
                        ["raw-html", function () { return player.r.rank.lte(20) ? "You are at rank <h3>" + formatWhole(player.r.rank) + ". (+" + formatWhole(player.r.ranksToGet) + ")"  : ""}, { "color": "white", "font-size": "24px", "font-family": "monospace" }],
                        ["raw-html", function () { return player.r.rank.gt(20) ? "You are at rank <h3>" + formatWhole(player.r.rank) +  ". (+" + formatWhole(player.r.ranksToGet) + "). \n<h6>(softcapped)"  : ""}, { "color": "white", "font-size": "24px", "font-family": "monospace" }],
                        ["raw-html", function () { return "Your rank boosts points by x" + format(player.r.rankEffect) + "." }, { "color": "white", "font-size": "20px", "font-family": "monospace" }],
                        ["row", [["clickable", 11]]],
                        ["blank", "25px"],
                        ["raw-html", function () { return "You are at tier <h3>" + formatWhole(player.r.tier) + ". (+" + formatWhole(player.r.tiersToGet) + ")"  }, { "color": "white", "font-size": "24px", "font-family": "monospace" }],
                        ["raw-html", function () { return "Your tier boosts points by x" + format(player.r.tierEffect) + "." }, { "color": "white", "font-size": "20px", "font-family": "monospace" }],
                        ["row", [["clickable", 12]]],
                        ["blank", "25px"],
                        ["raw-html", function () { return hasUpgrade("i", 13) ? "You are at tetr <h3>" + formatWhole(player.r.tetr) + ". (+" + formatWhole(player.r.tetrsToGet) + ")" : ""}, { "color": "white", "font-size": "24px", "font-family": "monospace" }],
                        ["raw-html", function () { return hasUpgrade("i", 13) ? "Your tetr boosts points by x" + format(player.r.tetrEffect) + "." : ""}, { "color": "white", "font-size": "20px", "font-family": "monospace" }],
                        ["row", [["clickable", 13]]],
                ]

            },
            "Pent": {
                buttonStyle() { return { 'color': 'white' } },
                unlocked() { return hasUpgrade("i", 18) },
                content:
                [
                        ["blank", "25px"],
                        ["raw-html", function () { return "You are at pent <h3>" + formatWhole(player.r.pent) + ". (+" + formatWhole(player.r.pentToGet) + ")"  }, { "color": "white", "font-size": "24px", "font-family": "monospace" }],
                        ["raw-html", function () { return "Your pent boosts prestige points by x" + format(player.r.pentEffect) + "." }, { "color": "white", "font-size": "20px", "font-family": "monospace" }],
                        ["row", [["clickable", 14]]],
                        ["blank", "25px"],
                        ["raw-html", function () { return "<h3>Milestones" }, { "color": "white", "font-size": "24px", "font-family": "monospace" }],
                        ["row", [["milestone", 11]]],    
                        ["row", [["milestone", 12]]],
                        ["row", [["milestone", 13]]],
                        ["row", [["milestone", 14]]],
                        ["row", [["milestone", 15]]],
                        ["row", [["milestone", 16]]],
                        ["row", [["milestone", 17]]],
                        ["row", [["milestone", 18]]],
                        ["row", [["milestone", 19]]],
                ]
            },
        },
    }, 

    tabFormat: [
                        ["raw-html", function () { return "You have <h3>" + format(player.points) + "</h3> celestial points." }, { "color": "white", "font-size": "24px", "font-family": "monospace" }],
         ["raw-html", function () { return "You are gaining <h3>" + format(player.gain) + "</h3> celestial points per second." }, { "color": "white", "font-size": "16px", "font-family": "monospace" }],
                        ["row", [["clickable", 1]]],
                        ["microtabs", "stuff", { 'border-width': '0px' }],
        ],
    layerShown() { return player.startedGame == true && hasUpgrade("i", 11) }
})