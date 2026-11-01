import type { Metadata } from "next";
import Link from "next/link";
import CopyButton from "@/components/CopyButton";
import { DISTRIBUTION_WALLET, TREASURY_WALLETS, type Wallet } from "@/lib/wallets";

export const metadata: Metadata = {
  title: "Official payment addresses — LaunchGate",
  description:
    "Official LaunchGate treasury wallets for advertisers and business partners.",
};

// Shows the address in groups of four so it is easier to check character by
// character. Groups are plain inline spans with no text between them, so
// selecting the address still copies it as one unbroken string.
function Address({ value }: { value: string }) {
  const groups = value.match(/.{1,4}/g) ?? [value];
  return (
    <code className='address'>
      {groups.map((g, i) => (
        <span
          key={i}
          className={
            i === 0 || i === groups.length - 1 ? 'edge' : undefined
          }
        >
          {g}
        </span>
      ))}
    </code>
  );
}

function WalletCard({ wallet }: { wallet: Wallet }) {
  const label = `${wallet.network}${wallet.standard ? ` ${wallet.standard}` : ""}`;
  return (
    <li className={'card'}>
      <div className={'cardHead'}>
        <h3 className={'network'}>{wallet.network}</h3>
        {wallet.standard && <span className={'tag'}>{wallet.standard}</span>}
      </div>
      <Address value={wallet.address} />
      <div className={'actions'}>
        <CopyButton value={wallet.address} label={label} />
        <a
          href={wallet.explorerUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={'explorer'}
        >
          View on {wallet.explorerName}
        </a>
      </div>
    </li>
  );
}

export default function PaymentsPage() {
  return (
    <main className={'page'}>
      <header className={'header'}>
        <h1 className={'title'}>Official payment addresses</h1>
        <p className={'lede'}>
          These are the only wallets LaunchGate accepts payments to. Send funds
          here only after your campaign has been scoped and agreed with our
          team.
        </p>
      </header>

      <div className={'notice'} role="note">
        <strong>Check before you send.</strong> Confirm the network and the full
        address, not just the first and last characters. A transfer sent on the
        wrong network cannot be recovered. If anything looks different from
        this page, contact us first.
      </div>

      <section aria-labelledby="treasury-heading" className={'section'}>
        <h2 id="treasury-heading" className={'sectionTitle'}>
          Treasury wallets
        </h2>
        <p className={'sectionNote'}>
          BNB Smart Chain, Ethereum and Base use the same address. Choose the
          network you were quoted when you send.
        </p>
        <ul className={'list'}>
          {TREASURY_WALLETS.map((w) => (
            <WalletCard key={w.id} wallet={w} />
          ))}
        </ul>
      </section>

      <section
        aria-labelledby="rewards-heading"
        className={`section rewards`}
      >
        <div className={'rewardsHead'}>
          <h2 id="rewards-heading" className={'sectionTitle'}>
            Reward distribution wallet
          </h2>
          <span className={'warnTag'}>Not for payments</span>
        </div>
        <p className={'sectionNote'}>
          This wallet sends rewards out to participants. Do not send advertiser
          payments to it.
        </p>
        <ul className={'list'}>
          <WalletCard wallet={DISTRIBUTION_WALLET} />
        </ul>
      </section>

      <p className={'footer'}>
        Questions about a payment? <Link href="/contact">Contact our team</Link>
        .
      </p>
    </main>
  );
}
