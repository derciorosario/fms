
import QRCode from "react-qr-code";
import { useData } from "../../contexts/DataContext";
import { t } from "i18next";

export const QrCodeSection = ({d}) => {

  const data=useData()
  const code = {
    validation_code: d?.validation_code,
    ticket_uuid: d?.uuid,
  };
  const token = data.generateToken(code);

  return (
    <div className="flex flex-col items-center justify-center text-center md:max-w-sm md:w-44">
      <span className="text-[13px] text-gray-500">{t('common.point-camera')}</span>
      <div className="w-36 h-36 border border-slate-500 p-3 rounded-md mt-2">
        {!token ? (
           <div className="_spinner-container">
              <div className="_spinner border-t-orange-500"></div>
            </div> 
        ) : (
          <QRCode
            size={256}
            style={{ height: "auto", maxWidth: "100%", width: "100%" }}
            value={token}
            viewBox={`0 0 256 256`}
          />
        )}
      </div>
      <span className="mt-1 flex text-[13px]">bilheteca.co.mz</span>
    </div>
  );
};
