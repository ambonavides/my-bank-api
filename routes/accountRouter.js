import express from "express";
import { accountModel } from "../models/accounts.js";

const app = express();

//registrar deposito
app.patch("/account/deposito/:agencia/:conta/:valor", async (req, res) => {
  try {
    const account = await accountModel.findOne({ conta: req.params.conta });
    if (!account) {
      res.status(404).send("Conta não encontrada.");
    }
    const newBalance = parseInt(account.balance) + parseInt(req.params.valor);

    //prettier-ignore
    await accountModel.updateOne(
      { conta: account.conta },
      { $set:
        {
          agencia: account.agencia,
          conta: account.conta,
          name: account.name,
          balance: newBalance
        }
      }
    );

    const accountUpdate = await accountModel.findOne({
      conta: req.params.conta,
    });

    res.send(accountUpdate);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

//registrar saque
app.patch("/account/saque/:agencia/:conta/:valor", async (req, res) => {
  try {
    const account = await accountModel.findOne({ conta: req.params.conta });
    if (!account) {
      res.status(404).send("Conta não encontrada.");
    }

    if (req.params.valor <= 0) {
      res.status(404).send("Não é possível realizar saque.");
    } else {
      const saldoTemp = account.balance - req.params.valor;
      if (saldoTemp <= 0) {
        res.status(404).send("Não contem saldo suficiente para saque.");
      }
    }

    //1 refere-se a valor de saque
    const newBalance =
      parseInt(account.balance) - parseInt(req.params.valor) - 1;

    //prettier-ignore
    await accountModel.updateOne(
      { conta: account.conta },
      { $set:
        {
          agencia: account.agencia,
          conta: account.conta,
          name: account.name,
          balance: newBalance
        }
      }
    );

    const accountUpdate = await accountModel.findOne({
      conta: req.params.conta,
    });

    res.send(accountUpdate);
  } catch (error) {
    res.status(500).send(error);
  }
});

//verifica saldo
app.get("/account/saldo/:agencia/:conta", async (req, res) => {
  try {
    const account = await accountModel.findOne({
      conta: req.params.conta,
    });
    if (!account) {
      res.status(404).send("Conta não encontrada.");
    }

    res.send(account);
  } catch (error) {
    res.status(500).send(error);
  }
});

//apagar conta
app.delete("/account/:agencia/:conta", async (req, res) => {
  try {
    const account = await accountModel.findOneAndDelete({
      agencia: req.params.agencia,
      conta: req.params.conta,
    });
    if (!account) {
      res.status(404).send("Conta não encontrada.");
    }
    res.status(200).send();
  } catch (error) {
    res.status(500).send(error);
  }
});

//transferência
//prettier-ignore
app.patch("/account/transferencia/:origem/:destino/:valor",
  async (req, res) => {
    try {
      const accountOrigem = await accountModel.findOne({
        conta: req.params.origem,
      });
      if (!accountOrigem) {
        res.status(404).send("Conta de origem não encontrada.");
      }

      const accountDestino = await accountModel.findOne({
        conta: req.params.destino,
      });
      if (!accountDestino) {
        res.status(404).send("Conta destino não encontrada.");
      }

      var newBalanceOrigem = 0;

      newBalanceOrigem = accountOrigem.balance - req.params.valor;
      if (accountOrigem.agencia != accountDestino.agencia) {
        newBalanceOrigem = newBalanceOrigem - 8;
      }

      //prettier-ignore
      await accountModel.updateOne(
        { conta: accountOrigem.conta },
        { $set:
          {
            agencia: accountOrigem.agencia,
            conta: accountOrigem.conta,
            name: accountOrigem.name,
            balance: newBalanceOrigem
          }
        }
      );

      const newBalanceDestino = parseInt(accountDestino.balance) + parseInt(req.params.valor);
      //prettier-ignore
      await accountModel.updateOne(
        { conta: accountDestino.conta },
        { $set:
          {
            agencia: accountDestino.agencia,
            conta: accountDestino.conta,
            name: accountDestino.name,
            balance: newBalanceDestino
          }
        }
      );

      res.send();
    } catch (error) {
      res.status(500).send(error);
    }
  }
);

//média saldo
app.get("/account/media/:agencia", async (req, res) => {
  try {
    const accounts = await accountModel.find({
      agencia: req.params.agencia,
    });

    var mediaBalance = 0;
    var tamanho = accounts.length;
    var mediaTotal = 0;

    accounts.forEach((e) => {
      mediaBalance = e.balance;
    });

    mediaTotal = mediaBalance / tamanho;

    console.log(mediaTotal);

    res.status(200).send();
  } catch (error) {
    res.status(500).send(error);
  }
});

//menor saldo
app.get("/account/menor/:valor", async (req, res) => {
  try {
    let qtd = parseInt(req.params.valor);

    const accounts = await accountModel.find().sort({ balance: 1 }).limit(qtd);

    console.log(accounts);

    res.send(accounts);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

//consultar os mais ricos
app.get("/account/ricos/:valor", async (req, res) => {
  try {
    let qtd = parseInt(req.params.valor);
    const accounts = await accountModel
      .find()
      .sort({ balance: -1, name: 1 })
      .limit(qtd);

    console.log(accounts);

    res.send(accounts);
  } catch (error) {
    res.status(500).send(error);
  }
});

export { app as accountRouter };
