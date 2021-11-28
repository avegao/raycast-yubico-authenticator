import { ActionPanel, CopyToClipboardAction, List } from "@raycast/api";
import { useEffect, useState } from "react";
import { $ } from "zx";

interface State {
  accounts?: string[];
  codes?: Record<string, string>;
  error?: Error;
}

export default function Command() {
  const [state, setState] = useState<State>({});

  async function getAccounts(): Promise<void> {
    const accountsCommand = await $`ykman oath accounts list`;
    const accounts = accountsCommand.stdout.split("\n").filter((element) => element != "");

    setState({ accounts });
  }

  useEffect(() => {
    getAccounts();
  }, []);

  return (
    <List isLoading={!state.accounts && !state.error}>
      {state.accounts?.map((account) =>
        <List.Item
          key={account}
          title={account}
          actions={<Actions account={account} />}
        />
      )}
    </List>
  );
}

function Actions(props: { account: string }) {
  const [state, setState] = useState<State>({});

  const { account } = props;

  async function getOathCode(): Promise<void> {
    const getCommand = await $`ykman oath accounts code ${account}`;
    const output = getCommand.stdout;
    const code = output.split(" ")[2];
    const state = { codes: {} as Record<string, string> };
    state.codes[account] = code;

    setState(state);
  }

  useEffect(() => {
    getOathCode();
  }, []);

  const code = state?.codes?.[account] ?? "Code not found";

  return (
    <ActionPanel title={account}>
      <CopyToClipboardAction title="Press to copy OTP code to clipboard..." content={code} />
    </ActionPanel>
  );
}


