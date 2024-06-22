import React, { useState } from "react";
import DatePicker from "react-datepicker";
import { Controller, useForm, FieldValues } from "react-hook-form";
import ReactSelect from "react-select";

interface FormField {
  type: string;
  id: string;
  name: string;
  label: string;
  placeHolder?: string;
  multiple?: boolean;
  isClearable?: boolean;
  isSearchable?: boolean;
  isCreatable?: boolean;
  notObjectValue?: boolean;
  builderIsListOfValue?: boolean;
  builderCreateSelectWith?: {
    label: string;
    value: string;
  };
  builderCollectionMappingLabelOrValue?: string;
  collection?: string;
  filters?: Record<string, unknown>;
  select?: {
    code: number;
    company: number;
  };
  optionMapping?: {
    label: string;
    value: string;
    objectName?: string;
  };
  valueUsed?: any[];
  options?: Option[];
  width: number;
  isDisabled: boolean;
  isHide?: boolean;
  buttonSchema?: ButtonSchema[];
  autoFillValueMapping?: any[];
  validation?: Validation;
  condition?: Condition;
  formFields: FormField[][];
}

interface Option {
  label: string;
  value: string;
}

interface ButtonSchema {
  type: string;
  btnType: string;
  schemaType: string;
  configName: string;
  btnText: string;
  iconName: string;
  queryString: string;
  isPlainButton: boolean;
}

interface Validation {
  required: boolean;
}

interface Condition {
  isHidden: boolean;
}

interface FormProps {
  formTitle: string;
  formFields: FormField[][];
}

const DynamicForm: React.FC<FormProps> = ({ formTitle, formFields }) => {
  const { control, handleSubmit, reset, getValues, setValue } =
    useForm<FieldValues>();
  const [inlineFormData, setInlineFormData] = useState<Record<string, any>[]>(
    []
  );

  const onSubmitForm = (data: FieldValues) => {
    alert("Data Submitted: " + JSON.stringify(data));
  };

  const handleAddInlineForm = (inlineFields: FormField[]) => {
    const values = getValues();
    const newEntry: Record<string, any> = {};

    inlineFields.forEach((field) => {
      newEntry[field.name] = values[field.name];
    });

    setInlineFormData([...inlineFormData, newEntry]);

    // Reset inline form fields
    inlineFields.forEach((field) => {
      setValue(field.name, "");
    });
  };

  const handleDeleteInlineFormEntry = (index: number) => {
    const updatedData = [...inlineFormData];
    updatedData.splice(index, 1);
    setInlineFormData(updatedData);
  };

  const renderField = (field: FormField) => {
    switch (field.type) {
      case "ListOfValues":
      case "Select":
        return (
          <Controller
            name={field.name}
            control={control}
            rules={{ required: field.validation?.required }}
            render={({ field: { onChange, value, name, ref } }) => (
              <ReactSelect
                ref={ref}
                value={field.options?.find((option) => option.value === value)}
                onChange={(val: any) => onChange(val?.value)}
                options={field.options}
                isClearable={field.isClearable}
                isDisabled={field.isDisabled}
                placeholder={field.placeHolder}
                className="w-full"
                name={name}
              />
            )}
          />
        );
      case "DatePicker":
        return (
          <Controller
            name={field.name}
            control={control}
            render={({ field: { onChange, value, ref } }) => (
              <DatePicker
                selected={value}
                onChange={onChange}
                ref={ref}
                className="w-full border px-3 border-gray-300 py-2 rounded"
                placeholderText={field.placeHolder}
                disabled={field.isDisabled}
              />
            )}
          />
        );

      case "Input":
        return (
          <Controller
            name={field.name}
            control={control}
            rules={{ required: field.validation?.required }}
            render={({ field: { onChange, onBlur, value, name, ref } }) => (
              <input
                ref={ref}
                name={name}
                onChange={onChange}
                onBlur={onBlur}
                value={value}
                type={field.type}
                placeholder={field.placeHolder}
                disabled={field.isDisabled}
                className="w-full px-3 py-2 border border-gray-300 rounded"
              />
            )}
          />
        );
      case "Upload":
        return (
          <Controller
            name={field.name}
            control={control}
            rules={{ required: field.validation?.required }}
            render={({ field: { onChange, onBlur, name, ref } }) => (
              <input
                ref={ref}
                name={name}
                type="file"
                onChange={(e) => onChange(e.target.files)}
                onBlur={onBlur}
                disabled={field.isDisabled}
                className="w-full px-3 py-2 border border-gray-300 rounded"
              />
            )}
          />
        );

      case "InLineForm":
        return (
          <div>
            {field.formFields?.map((inlineFields, index) => (
              <div key={index}>
                <div className="grid grid-cols-1 gap-4">
                  {inlineFields.map((inLineField) => (
                    <div className="w-full" key={inLineField.id}>
                      <label className="block text-sm text-gray-700 font-medium">
                        {inLineField.label}
                      </label>
                      {renderField(inLineField)}
                    </div>
                  ))}
                </div>
                <div className="mt-2">
                  <button
                    type="button"
                    onClick={() => handleAddInlineForm(inlineFields)}
                    className="bg-green-500 text-white px-4 py-2 text-sm font-bold rounded"
                  >
                    Add
                  </button>
                </div>
              </div>
            ))}
            {inlineFormData.length > 0 && (
              <table className="min-w-full divide-y divide-gray-200 mt-4">
                <thead className="bg-gray-50">
                  <tr>
                    {field.formFields[0].map((inLineField) => (
                      <th
                        key={inLineField.id}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {inLineField.label}
                      </th>
                    ))}
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {inlineFormData.map((entry, index) => (
                    <tr key={index}>
                      {field.formFields[0].map((inLineField) => (
                        <td key={inLineField.id} className="px-6 py-4">
                          {entry[inLineField.name]}
                        </td>
                      ))}
                      <td className="px-6 py-4">
                        <button
                          type="button"
                          onClick={() => handleDeleteInlineFormEntry(index)}
                          className="bg-red-500 text-white px-2 py-1 text-sm font-bold rounded"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmitForm)}
      className="space-y-6 bg-white p-6 rounded-lg shadow-md"
    >
      <h2 className="text-2xl font-bold mb-4 text-center">{formTitle}</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {formFields.flat().map((field) => (
          <div
            key={field.id}
            className={`w-full md:col-span-${Math.ceil(field.width / 25)}`}
          >
            <label className="block text-sm font-medium text-gray-700">
              {field.label}
            </label>

            {renderField(field)}
          </div>
        ))}
      </div>
      <div className="flex justify-end">
        <button
          type="submit"
          className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50"
        >
          Submit
        </button>
      </div>
    </form>
  );
};

export default DynamicForm;
