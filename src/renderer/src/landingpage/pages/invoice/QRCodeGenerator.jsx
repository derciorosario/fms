import React from 'react';
import QRCode from 'qrcode.react';
import { t } from 'i18next';

const QRCodeGenerator = ({ link }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center md:max-w-sm md:w-44">
    <span className="text-[13px] text-gray-500 hidden">{t('common.point-camera')}</span>
    <div className="w-36 h-36 border border-slate-500 p-[0.5rem] rounded-md mt-2">
        <QRCode value={link} />
    </div>
    <span className="mt-1 flex text-[13px]">bilheteca.co.mz</span>
    </div>
  );
};

export default QRCodeGenerator;
