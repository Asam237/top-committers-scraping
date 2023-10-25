import axios from "axios";
import cheerio from "cheerio";
import fs from "fs";
import { createObjectCsvWriter } from "csv-writer";
import readline from "readline";

const inquirer = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const array = [
  { myId: 1, Country: "cameroon" },
  { myId: 2, Country: "algeria" },
  { myId: 3, Country: "angola" },
];

const transformed = array.reduce((acc: any, { myId, ...x }) => {
  acc[myId] = x;
  return acc;
}, {});

console.table(transformed);
interface IUser {
  rank: number;
  user: string;
  contribs: string;
}

inquirer.question("\n\nEnter the country: ", async (country) => {
  const url = "https://committers.top/" + country;
  const cvWriter = createObjectCsvWriter({
    path: "./users.csv",
    header: [
      { id: "index", title: "Rank" },
      { id: "user", title: "User" },
      { id: "contribs", title: "Contribs" },
    ],
  });
  const AxiosInstance = axios.create();
  AxiosInstance.get(url)
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);
      const usersRow = $(".users-list > tbody > tr");
      const users: IUser[] = [];
      usersRow.each((i, elem) => {
        const contribs: string = $(elem).find("td:nth-child(3)").text();
        const user: string = $(elem).find("td:nth-child(2)").children().text();
        users.push({ rank: i + 1, user, contribs });
      });
      console.log(
        "\nThe list has been successfully registered. Please consult your JSON and CSV files. Thank you !\n"
      );
      const jsonContent = JSON.stringify(users);
      cvWriter.writeRecords(users);
      fs.writeFile("./users.json", jsonContent, "utf8", (error) => {
        if (error) console.log(error);
      });
    })
    .catch(console.error);
});
