import React from 'react';

type InputProps = {
  defaultValue?: string;
  label: string;
  name: string;
  register: any;
  required: boolean;
};

const Input = ({ defaultValue, name, label, register, required }: InputProps): JSX.Element => (
  <div className="flex flex-col mb-2">
    <label>{label}</label>
    <input {...register(name, { defaultValue, required })} />
  </div>
);

export default Input;