import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../api/client';
import { PlusIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

export const TemplateList: React.FC = () => {
  const { data: templates, isLoading } = useQuery(['templates'], () =>
    api.getTemplates().then((res) => res.data)
  );

  if (isLoading) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Email Templates</h2>
        <Link
          to="/templates/new"
          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md flex items-center"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          New Template
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates?.map((template: any) => (
          <div
            key={template.templateId}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <h3 className="text-lg font-semibold mb-2">{template.templateName}</h3>
            <p className="text-gray-600 mb-4">{template.subject}</p>
            <div className="flex justify-end">
              <Link
                to={`/templates/${template.templateId}`}
                className="text-primary-600 hover:text-primary-700"
              >
                Edit Template
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 