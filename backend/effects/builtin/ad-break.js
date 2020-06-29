"use strict";

const { ControlKind, InputEvent } = require('../../interactive/constants/MixplayConstants');
const effectModels = require("../models/effectModels");
const { EffectDependency, EffectTrigger } = effectModels;
const { EffectCategory } = require('../../../shared/effect-constants');

const accountAccess = require("../../common/account-access");

const channelAccess = require("../../common/channel-access");

const model = {
    definition: {
        id: "firebot:ad-break",
        name: "Ad Break",
        description: "Trigger an ad-break",
        hidden: !accountAccess.getAccounts().streamer.loggedIn || !accountAccess.getAccounts().streamer.partnered,
        icon: "fad fa-ad",
        categories: [EffectCategory.COMMON, EffectCategory.MODERATION],
        dependencies: [EffectDependency.CHAT],
        triggers: effectModels.buildEffectTriggersObject(
            [ControlKind.BUTTON],
            [InputEvent.MOUSEDOWN, InputEvent.KEYDOWN],
            EffectTrigger.ALL
        )
    },
    globalSettings: {},
    optionsTemplate: `
        <eos-container>
            <div class="btn-group">
                <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <span class="ad-effect-type">{{effect.adLength ? effect.adLength : 'Pick one'}}</span> <span class="caret"></span>
                </button>
                <ul class="dropdown-menu ad-effect-dropdown">
                    <li ng-click="effect.adLength = 30">
                        <a href>30 sec</a>
                    </li>
                    <li ng-click="effect.adLength = 60">
                        <a href>60 sec</a>
                    </li>
                    <li ng-click="effect.adLength = 90">
                        <a href>90 sec</a>
                    </li>
                    <li ng-click="effect.adLength = 120">
                        <a href>120 sec</a>
                    </li>
                    <li ng-click="effect.adLength = 150">
                        <a href>150 sec</a>
                    </li>
                    <li ng-click="effect.adLength = 180">
                        <a href>180 sec</a>
                    </li>
                </ul>
            </div>
        </eos-container>
    `,
    optionsController: () => {},
    optionsValidator: () => {
        return [];
    },
    onTriggerEvent: async event => {
        let adLength = event.effect.adLength;

        if (adLength == null) {
            adLength = 30;
        }

        await channelAccess.triggerAdBreak(adLength);
        return true;
    }
};

module.exports = model;
