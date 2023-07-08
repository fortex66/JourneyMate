import { useFieldArray, useForm } from "react-hook-form";
const AddFrom = () => {
  const { control, register } = useForm({
    defaultValues: {
      shootingColors: [{ name: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: `shootingColors`,
  });

  // handlers
  const addColorQuantity = (e) => {
    e.preventDefault();
    append({ name: "" });
  };

  const subColorQuanaity = (idx) => (e) => {
    e.preventDefault();
    remove(idx);
  };

  return (
    <div>
      {fields.map((field, idx) => (
        <input {...register(`shootingColors.${idx}.name`)}></input>
      ))}
      <button onClick={addColorQuantity}>+</button>
    </div>
  );
};

export default AddFrom;
