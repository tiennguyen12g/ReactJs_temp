import React from "react";
import CryptoNews from "./CryptoNews";
import CryptoPrices from "./CryptoPrices";
import { useI18n } from "../i18n";
export default function CryptoMain() {
    const { t } = useI18n();
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Crypto Prices Section */}
      <section>
        <CryptoPrices />
      </section>

      {/* Crypto News Section */}
      <section>
        <CryptoNews />
      </section>
              <footer className="mt-12 text-center text-gray-400 text-sm">
          <p>© 2024 {t("app.title")}. Data provided by CoinGecko & CryptoCompare</p>
        </footer>
    </div>
  );
}
