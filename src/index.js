"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const cheerio_1 = __importDefault(require("cheerio"));
const fs_1 = __importDefault(require("fs"));
const csv_writer_1 = require("csv-writer");
const readline_1 = __importDefault(require("readline"));
const inquirer = readline_1.default.createInterface({
    input: process.stdin,
    output: process.stdout,
});
const array = [
    { myId: 1, Country: "cameroon" },
    { myId: 2, Country: "algeria" },
    { myId: 3, Country: "angola" },
];
const transformed = array.reduce((acc, _a) => {
    var { myId } = _a, x = __rest(_a, ["myId"]);
    acc[myId] = x;
    return acc;
}, {});
console.table(transformed);
inquirer.question("\n\nEnter the country: ", (country) => __awaiter(void 0, void 0, void 0, function* () {
    const url = "https://committers.top/" + country;
    const cvWriter = (0, csv_writer_1.createObjectCsvWriter)({
        path: "./users.csv",
        header: [
            { id: "index", title: "Rank" },
            { id: "user", title: "User" },
            { id: "contribs", title: "Contribs" },
        ],
    });
    const AxiosInstance = axios_1.default.create();
    AxiosInstance.get(url)
        .then((response) => {
        const html = response.data;
        const $ = cheerio_1.default.load(html);
        const usersRow = $(".users-list > tbody > tr");
        const users = [];
        usersRow.each((i, elem) => {
            const contribs = $(elem).find("td:nth-child(3)").text();
            const user = $(elem).find("td:nth-child(2)").children().text();
            users.push({ rank: i + 1, user, contribs });
        });
        console.log("\nThe list has been successfully registered. Please consult your JSON and CSV files. Thank you !\n");
        const jsonContent = JSON.stringify(users);
        cvWriter.writeRecords(users);
        fs_1.default.writeFile("./users.json", jsonContent, "utf8", (error) => {
            if (error)
                console.log(error);
        });
    })
        .catch(console.error);
}));
