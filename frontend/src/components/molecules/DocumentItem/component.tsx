import React from 'react';
import { Button } from '@/components/atoms/Button';
import { DocumentItemProps } from './types';

const DocumentItem: React.FC<DocumentItemProps> = ({ title, category, onDownload }) => (
  <div className="flex items-center justify-between p-4 border rounded shadow-sm">
    <div>
      <p className="font-semibold">{title}</p>
      <p className="text-sm text-gray-500">{category}</p>
    </div>
    <Button onClick={onDownload}>Télécharger</Button>
  </div>
);

export default DocumentItem;