import { ClientLayout } from "@client/components/ClientLayout/ClientLayout";
import { ClientCart } from "@client/pages/ClientCart/ClientCart";
import { ClientCatalog } from "@client/pages/ClientCatalog/ClientCatalog";
import { DefaultLayout } from "@shared/ui/components/DefaultLayout/DefaultLayout";
import { Routes, Route, Navigate, useSearchParams } from "react-router-dom";
import { AppNavigaions, AppRoutes } from "./_routes/routes";
import { QPortsPage } from "@admin/pages/QPortsPage/QPortsPage";
import { useCatalogStore } from "@store/useCatalogStore";
import { useSessionStore } from "@store/useSessionStore";
import { useEffect } from "react";
import { useOrderStore } from "@store/useOrderStore";
import { useSetPrimaryData } from "@shared/hooks/useSetPrimaryData";

export const AppCore = () => {
  const [searchParams] = useSearchParams();

  const qrCodeId = searchParams.get("code");
  const startSession = useSessionStore((s) => s.startSession);

  const isDefaultDataLoaded = useSetPrimaryData();

  useEffect(() => {
    if (qrCodeId && isDefaultDataLoaded) {
      const askName = async () => {
        while (true) {
          const answer = prompt("Enter your name");
          if (answer && answer.trim()) {
            await startSession({
              userName: answer,
              qrCodeId: qrCodeId,
            });

            break;
          }
          alert("Имя не может быть пустым");
        }
      };
      askName();
    }
  }, [qrCodeId, startSession, isDefaultDataLoaded]);

  const fetchAllOrders = useOrderStore((s) => s.fetchAll);
  useEffect(() => {
    if (!qrCodeId) {
      return;
    }
    const timerId = setInterval(() => {
      fetchAllOrders({ qrCodeId });
    }, 3000);
    fetchAllOrders({ qrCodeId });

    return () => {
      clearInterval(timerId);
    };
  }, [qrCodeId, fetchAllOrders]);

  const fetchAllCatalog = useCatalogStore((s) => s.fetchAll);
  useEffect(() => {
    fetchAllCatalog();
  }, [fetchAllCatalog]);

  return (
    <Routes>
      {/* Client */}
      <Route element={<ClientLayout links={AppNavigaions.client} />}>
        <Route path={AppRoutes.client.main} element={<ClientCatalog />} />
        <Route path={AppRoutes.client.cart} element={<ClientCart />} />
      </Route>

      {/* Admin */}
      <Route element={<DefaultLayout links={AppNavigaions.admin} />}>
        <Route path={AppRoutes.admin.main} element={<QPortsPage />} />
        <Route path={AppRoutes.admin.qports} element={<QPortsPage />} />
        <Route path={AppRoutes.admin.catalog} element={<QPortsPage />} />
      </Route>

      {/* Redirect */}
      <Route
        path="/*"
        element={<Navigate to={AppRoutes.client.main} replace />}
      />
    </Routes>
  );
};
