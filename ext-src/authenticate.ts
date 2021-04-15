import * as polka from "polka";
import * as vscode from "vscode";

const authenticate = () => {
  const app = polka();

  app.get("/auth/:token", (req, res) => {
    const { token } = req["params"];
    if (!token) {
      res.end(
        `<html><body><h1 style="color:#1F639C; font-family: Arial, Verdana, sans-serif;">Todos VSCode Extension</h1><h3 style="font-family: Arial, Verdana, sans-serif;">Authentication with Github failed! Try again!</h3></body></html>`
      );
      app.server!.close();
      return;
    }
    res.end(
      `<html><body><img src="https://tetranoodle.com/wp-content/uploads/2018/07/tick-gif.gif"/><h1 style="color:#1F639C; font-family: Arial, Verdana, sans-serif;">Todos VSCode Extension</h1><h3 style="font-family: Arial, Verdana, sans-serif;">Authentication with Github was successful! You can now safely close this tab.</h3></body></html>`
    );
    app.server!.close();

    console.log(token);
  });

  app.listen(8888, (err: Error) => {
    if (err) {
      vscode.window.showErrorMessage(err.message);
    } else {
      vscode.commands.executeCommand(
        "vscode.open",
        vscode.Uri.parse(`http://localhost:8000/api/auth/github`)
      );
    }
  });

  console.log("Authenticated");
};

export default authenticate;
