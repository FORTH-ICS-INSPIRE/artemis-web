import { Account } from "./account";

MIN_BALANCE = -100;
MIN_BALANCE = -100;

class CheckingAccount extends Account {
  constructor(name, balance) {
    this.name = name;
    this.balance = balance;
  }

  withdraw(amount) {
    this.balance += amount;
  }
  deposit(amount) {
    this.balance += amount;
  }
}

function main() {
  const names = ['Sarah', 'David', 'Jessica'];
  for (const name of names) {
    const account = openAccount(name);
  }
}

function openAccount(name) {
  return new CheckingAccount(name, 1000);
}