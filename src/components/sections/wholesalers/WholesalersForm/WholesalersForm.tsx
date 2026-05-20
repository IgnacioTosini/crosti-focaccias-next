'use client';

import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { BsWhatsapp } from 'react-icons/bs';
import { FaRegBuilding, FaRegUser } from 'react-icons/fa';
import { FiPhone } from 'react-icons/fi';
import { IoLogoInstagram } from 'react-icons/io5';
import { sendWholesalerWhatsApp, type WholesalerFormValues } from '@/utils/buildWholesalerMessage';
import './_wholesalersForm.scss';

const initialValues: WholesalerFormValues = {
    name: '',
    business: '',
    social: '',
    phone: '',
    details: '',
};

const validationSchema = Yup.object({
    name: Yup.string().trim().required('El nombre es obligatorio'),
    business: Yup.string(),
    social: Yup.string(),
    phone: Yup.string()
        .trim()
        .matches(/^[\d\s\+\-\(\)]{7,20}$/, 'Ingresá un teléfono válido')
        .required('El teléfono es obligatorio'),
    details: Yup.string(),
});

export const WholesalersForm = () => {
    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={(values) => sendWholesalerWhatsApp(values)}
        >
            {({ errors, touched }) => (
                <Form className="wholesalersForm" noValidate>
                    <div className="wholesalersFormGrid">
                        <div className="fieldGroup">
                            <label htmlFor="name">Nombre *</label>
                            <div className={`inputWithIcon${errors.name && touched.name ? ' inputWithIcon--error' : ''}`}>
                                <FaRegUser className="fieldIcon" aria-hidden="true" />
                                <Field id="name" name="name" type="text" placeholder="Tu nombre" />
                            </div>
                            <ErrorMessage name="name" component="p" className="fieldError" />
                        </div>

                        <div className="fieldGroup">
                            <label htmlFor="business">Negocio / Empresa</label>
                            <div className="inputWithIcon">
                                <FaRegBuilding className="fieldIcon" aria-hidden="true" />
                                <Field id="business" name="business" type="text" placeholder="Nombre de tu local o empresa" />
                            </div>
                        </div>

                        <div className="fieldGroup">
                            <label htmlFor="social">Instagram o web</label>
                            <div className="inputWithIcon">
                                <IoLogoInstagram className="fieldIcon" aria-hidden="true" />
                                <Field id="social" name="social" type="text" placeholder="@tunegocio o www.tunegocio.com" />
                            </div>
                        </div>

                        <div className="fieldGroup">
                            <label htmlFor="phone">Teléfono *</label>
                            <div className={`inputWithIcon${errors.phone && touched.phone ? ' inputWithIcon--error' : ''}`}>
                                <FiPhone className="fieldIcon" aria-hidden="true" />
                                <Field id="phone" name="phone" type="tel" placeholder="Tu numero de contacto" />
                            </div>
                            <ErrorMessage name="phone" component="p" className="fieldError" />
                        </div>

                        <div className="fieldGroup fullWidth">
                            <label htmlFor="details">Contanos sobre tu negocio</label>
                            <Field
                                as="textarea"
                                id="details"
                                name="details"
                                rows={4}
                                placeholder="¿Qué tipo de local tenés? ¿Para qué ocasión necesitás las focaccias? Cualquier detalle que nos ayude a preparar la mejor propuesta..."
                            />
                        </div>
                    </div>

                    <button type="submit" className="whatsappButton">
                        <BsWhatsapp aria-hidden="true" />
                        Consultar por WhatsApp
                    </button>

                    <p className="formFootnote">
                        Al enviar, te abrimos WhatsApp con toda la info precargada. Tu consulta también queda guardada para hacerte seguimiento.
                    </p>
                </Form>
            )}
        </Formik>
    );
};
