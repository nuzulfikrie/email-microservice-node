import React from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery } from '@tanstack/react-query';
import { api } from '../../api/client';

interface SendEmailForm {
  templateId: string;
  recipients: string;
  data: string;
  scheduledDate?: string;
}

export const SendEmailForm: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<SendEmailForm>();

  const { data: templates } = useQuery(['templates'], () =>
    api.getTemplates().then((res) => res.data)
  );

  const sendMutation = useMutation((data: SendEmailForm) =>
    api.sendMail({
      ...data,
      recipients: data.recipients.split(',').map((email) => email.trim()),
      data: JSON.parse(data.data),
    })
  );

  const onSubmit = (data: SendEmailForm) => {
    sendMutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Send Email</h2>

      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Template</label>
        <select
          {...register('templateId', { required: 'Template is required' })}
          className="w-full border rounded-md p-2"
        >
          <option value="">Select a template</option>
          {templates?.map((template: any) => (
            <option key={template.templateId} value={template.templateId}>
              {template.templateName}
            </option>
          ))}
        </select>
        {errors.templateId && (
          <p className="text-red-500 text-sm mt-1">{errors.templateId.message}</p>
        )}
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Recipients (comma-separated)</label>
        <input
          {...register('recipients', { required: 'Recipients are required' })}
          className="w-full border rounded-md p-2"
          placeholder="email1@example.com, email2@example.com"
        />
        {errors.recipients && (
          <p className="text-red-500 text-sm mt-1">{errors.recipients.message}</p>
        )}
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Template Data (JSON)</label>
        <textarea
          {...register('data', { required: 'Template data is required' })}
          className="w-full border rounded-md p-2 h-32"
          placeholder='{"name": "John", "company": "Acme Inc"}'
        />
        {errors.data && (
          <p className="text-red-500 text-sm mt-1">{errors.data.message}</p>
        )}
      </div>

      <div className="mb-6">
        <label className="block text-gray-700 mb-2">Schedule (optional)</label>
        <input
          type="datetime-local"
          {...register('scheduledDate')}
          className="w-full border rounded-md p-2"
        />
      </div>

      <button
        type="submit"
        className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-md"
        disabled={sendMutation.isLoading}
      >
        {sendMutation.isLoading ? 'Sending...' : 'Send Email'}
      </button>
    </form>
  );
}; 