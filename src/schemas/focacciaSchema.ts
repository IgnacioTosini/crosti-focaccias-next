import * as Yup from 'yup';

export const focacciaSchema = Yup.object({
    name: Yup.string().required('El nombre es obligatorio'),
    description: Yup.string().required('La descripción es obligatoria'),
    mediumPrice: Yup.number().typeError('Debe ser un número').positive('Debe ser mayor a 0').required('El precio mediana es obligatorio'),
    largePrice: Yup.number().typeError('Debe ser un número').positive('Debe ser mayor a 0').required('El precio grande es obligatorio'),
    isVeggie: Yup.boolean(),
    featured: Yup.boolean(),
    isAvailable: Yup.boolean(),
});
