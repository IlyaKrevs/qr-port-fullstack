import styles from "./QPortsPage.module.css";
import { useQPortsStore } from "@/store/useQPortsStore";
import { AppButton } from "@shared/ui/components/AppButton/AppButton";
import { useEffect, useState } from "react";

export const QPortsPage: React.FC = () => {
  const fetchAllQRCodes = useQPortsStore((s) => s.fetchAll);
  const qrCodes = useQPortsStore((s) => s.items);
  const isLoading = useQPortsStore((s) => s.loading);
  const addQPort = useQPortsStore((s) => s.addPort);
  const deletePort = useQPortsStore((s) => s.deletePort);
  const [name, setName] = useState("");

  useEffect(() => {
    fetchAllQRCodes();
  }, [fetchAllQRCodes]);

  if (isLoading) return <div>Загрузка QR-кодов...</div>;

  return (
    <div>
      <h1>🔲 QR-коды для столиков</h1>
      <p>Распечатай и положи на столы</p>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <AppButton children={"PRESS ME"} onClick={() => addQPort(name)} />
      <div className={styles.container}>
        {qrCodes.map((qr) => (
          <div
            key={qr.id}
            style={{
              border: "1px solid #ccc",
              borderRadius: 12,
              padding: 15,
              textAlign: "center",
              background: "#6082df",
            }}
          >
            <h3>🍽️ {qr.name}</h3>
            <AppButton
              children="DELETE"
              onClick={() => deletePort(qr.id)}
            />
            <img
              src={qr.qrDataUrl}
              alt={`QR-код для ${qr.name}`}
              style={{
                width: 150,
                height: 150,
                margin: "10px auto",
                display: "block",
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
