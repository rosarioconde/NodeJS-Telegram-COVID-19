const axios = require("axios"),
    schedule = require("node-schedule"),
    Telegraf = require("telegraf");

const acces_token_telegram = "";
const chat_id = "";

class Tracker {
    constructor(telegramBot) {
        this.telegramBot = telegramBot

        this.country = {
            confirmed: 0,
            deaths: 0,
            recovered: 0
        };
    }

    initialize = async () => {
        this.setDataNotify();
        schedule.scheduleJob("45 12 * * 0-6", () => {
            this.setDataNotify();
        });
    };

    getDataFromCountry = async country => {
        try {
            const result = await axios.get(
                `https://wuhan-coronavirus-api.laeyoung.endpoint.ainize.ai/jhu-edu/latest?iso2=${country}&onlyCountries=true`
            );
            return result.data;
        } catch (err) {
            throw new Error(`Error al obtener info sobre ${country}`);
        }
    };

    setDataNotify = async () => {
        const country = await this.getDataFromCountry("AR");
        if (this.country.confirmed != country[0].confirmed ||
            this.country.deaths != country[0].deaths ||
            this.country.recovered != country[0].recovered) {

            this.country = {
                confirmed: country[0].confirmed,
                deaths: country[0].deaths,
                recovered: country[0].recovered
            }
            this.telegramBot.telegram.sendMessage(
                chat_id,
                `🇳🇮 | Argentina | Confirmados: ${this.country.confirmed}, Fallecidos: ${this.country.deaths}, Recuperados: ${this.country.recovered}`
            );
        }
    }
};

const telegramBot = new Telegraf(acces_token_telegram);
const tracker = new Tracker(telegramBot);
tracker.initialize();

