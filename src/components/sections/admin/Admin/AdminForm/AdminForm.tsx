'use client';

import { useEffect, useState } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import { FaCheckCircle, FaImage, FaLeaf, FaSave, FaStar, FaTimes, FaTrashAlt } from 'react-icons/fa';
import { focacciaSchema } from '@/schemas/focacciaSchema';
import { ImageOptimizerPreview } from '@/components/media/ImageOptimizer/ImageOptimizerPreview';
import { ImageService } from '@/services/ImageService';
import type { FocacciaItem } from '@/types';
import { useUpdateFocaccia } from '@/hooks/focaccia/useUpdateFocaccia';
import { useCreateFocaccia } from '@/hooks/focaccia/useCreateFocaccia';
import { toast } from 'react-toastify';
import './_adminForm.scss';

interface Props {
  focacciaEdit: FocacciaItem | null
  onClose: () => void
}

export const AdminForm = ({ focacciaEdit, onClose }: Props) => {
  const createMutation = useCreateFocaccia()
  const updateMutation = useUpdateFocaccia()

  const [optimizedImageFile, setOptimizedImageFile] = useState<File | null>(null);
  const [optimizationStats, setOptimizationStats] = useState<{
    originalSize: number;
    optimizedSize: number;
    compressionRatio: number;
  } | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [imageKey, setImageKey] = useState(0); // Para forzar re-render del componente imagen

  useEffect(() => {
    // Limpiar estados de imagen tanto al crear como al cambiar de edición
    setOptimizedImageFile(null);
    setOptimizationStats(null);
    setImageKey(prev => prev + 1); // Forzar re-render del componente imagen
  }, [focacciaEdit]);

  const handleClearImage = () => {
    setOptimizedImageFile(null);
    setOptimizationStats(null);
  };

  const handleImageOptimized = (file: File, stats: { originalSize: number; optimizedSize: number; compressionRatio: number }) => {
    // Solo procesar si el archivo tiene contenido
    if (file.size > 0 && file.name) {
      setOptimizedImageFile(file);
      setOptimizationStats(stats);

      if (stats.compressionRatio > 0) {
        toast.success(`¡Imagen optimizada! Reducción del ${stats.compressionRatio}%`);
      } else {
        toast.info('¡Imagen procesada! Ya tenía un tamaño óptimo');
      }
    }
  };

  const uploadImageToCloudinary = async (file: File): Promise<{ url: string; publicId: string }> => {
    try {
      // Usar el ImageService ya configurado pero SIN optimización adicional (ya está optimizada)
      const response = await ImageService.uploadImage(file, { enableOptimization: false });

      if (!response.success) {
        throw new Error(response.error || 'Error al subir imagen');
      }

      return {
        url: response.url,
        publicId: response.public_id
      };
    } catch (error) {
      console.error('Error en uploadImageToCloudinary:', error);
      throw error;
    }
  };

  return (
    <div className='adminFormContainer'>
      <div className='adminFormHeader'>
        <div>
          <span>{focacciaEdit ? 'Edición de catálogo' : 'Alta de producto'}</span>
          <h2>{focacciaEdit ? 'Editar Focaccia' : 'Nueva Focaccia'}</h2>
          <p>Completá la información que va a ver el cliente en el menú.</p>
        </div>
        <button
          type='button'
          className='adminFormCloseButton'
          onClick={() => {
            onClose();
            setOptimizedImageFile(null);
            setOptimizationStats(null);
            setImageKey(prev => prev + 1);
          }}
          aria-label='Cerrar formulario'
        >
          <FaTimes />
        </button>
      </div>

      <Formik
        enableReinitialize
        initialValues={
          focacciaEdit ? {
            name: focacciaEdit.name,
            description: focacciaEdit.description,
            mediumPrice: focacciaEdit.mediumPrice,
            largePrice: focacciaEdit.largePrice,
            isVeggie: focacciaEdit.isVeggie,
            featured: focacciaEdit.featured,
            isAvailable: focacciaEdit.isAvailable,
          } : {
            name: '',
            description: '',
            mediumPrice: '',
            largePrice: '',
            isVeggie: true,
            featured: false,
            isAvailable: true,
          }
        }
        validationSchema={focacciaSchema}
        onSubmit={async (values, { resetForm, setSubmitting }) => {
          try {
            setIsUploadingImage(true);
            let imageUrl = focacciaEdit?.imageUrl || '';
            let imagePublicId = focacciaEdit?.imagePublicId || '';

            // Si hay una imagen optimizada nueva, subirla a Cloudinary ahora
            if (optimizedImageFile) {
              try {
                // Si estamos editando y había una imagen anterior, eliminarla primero
                if (focacciaEdit && focacciaEdit.imagePublicId) {
                  try {
                    await ImageService.deleteImage(focacciaEdit.imagePublicId);
                  } catch (deleteError) {
                    console.warn('⚠️ No se pudo eliminar la imagen anterior:', deleteError);
                    // Continuar con la subida de la nueva imagen aunque falle la eliminación
                  }
                }

                const uploadResult = await uploadImageToCloudinary(optimizedImageFile);
                imageUrl = uploadResult.url;
                imagePublicId = uploadResult.publicId;
                toast.success('¡Imagen subida exitosamente!');
              } catch (error) {
                console.error('Error subiendo imagen:', error);
                toast.error('Error al subir la imagen a Cloudinary');
                setSubmitting(false);
                setIsUploadingImage(false);
                return;
              }
            }

            // Validar que tenemos imagen
            if (!imageUrl && !focacciaEdit) {
              toast.error('Debes seleccionar una imagen.');
              setSubmitting(false);
              setIsUploadingImage(false);
              return;
            }

            if (focacciaEdit) {
              // Modo edición
              await updateMutation.mutateAsync({
                id: focacciaEdit.id,
                data: {
                  ...values,
                  price: Number(values.mediumPrice),
                  mediumPrice: Number(values.mediumPrice),
                  largePrice: Number(values.largePrice),
                  imageUrl,
                  imagePublicId,
                }
              })
              toast.success('Focaccia actualizada exitosamente');
              // Resetear estados de imagen después de actualización exitosa
              setOptimizedImageFile(null);
              setOptimizationStats(null);
              setImageKey(prev => prev + 1); // Forzar re-render del componente imagen
              resetForm();
              onClose();
            } else {
              // Modo creación
              await createMutation.mutateAsync({
                ...values,
                price: Number(values.mediumPrice),
                mediumPrice: Number(values.mediumPrice),
                largePrice: Number(values.largePrice),
                imageUrl,
                imagePublicId,
              })

              toast.success('Focaccia creada exitosamente')
              // Resetear estados de imagen después de creación exitosa
              setOptimizedImageFile(null);
              setOptimizationStats(null);
              setImageKey(prev => prev + 1); // Forzar re-render del componente imagen
              resetForm();
              onClose();
            }
          } catch (err) {
            toast.error('Error al guardar la focaccia: ' + (err));
          } finally {
            setSubmitting(false);
            setIsUploadingImage(false);
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form className='adminForm'>
            <section className='adminFormSection'>
              <div className='adminFormSectionHeader'>
                <span>1</span>
                <div>
                  <h3>Datos principales</h3>
                  <p>Nombre, descripción y precios base.</p>
                </div>
              </div>

              <div className='adminFormGrid'>
                <div className='formGroup formGroupWide'>
                  <label htmlFor="name">Nombre</label>
                  <Field type="text" id="name" name="name" placeholder="Ej: Focaccia de Zucchini y Ricotta" />
                  <ErrorMessage name="name" component="div" className="error" />
                </div>
                <div className='formGroup'>
                  <label htmlFor="mediumPrice">Precio mediana</label>
                  <Field type="number" id="mediumPrice" name="mediumPrice" placeholder="12000" />
                  <ErrorMessage name="mediumPrice" component="div" className="error" />
                </div>
                <div className='formGroup'>
                  <label htmlFor="largePrice">Precio grande</label>
                  <Field type="number" id="largePrice" name="largePrice" placeholder="16000" />
                  <ErrorMessage name="largePrice" component="div" className="error" />
                </div>
                <div className='formGroup formGroupFull'>
                  <label htmlFor="description">Descripción</label>
                  <Field as="textarea" id="description" name="description" placeholder="Contá ingredientes, estilo o detalle especial." />
                  <ErrorMessage name="description" component="div" className="error" />
                </div>
              </div>
            </section>

            <section className='adminFormSection'>
              <div className='adminFormSectionHeader'>
                <span><FaImage /></span>
                <div>
                  <h3>Imagen del producto</h3>
                  <p>Se optimiza antes de subirse al guardar.</p>
                </div>
              </div>

              <div className='imageRow'>
                <div className='formGroup imageFormGroup'>
                <ImageOptimizerPreview
                  key={focacciaEdit ? `edit-${focacciaEdit.id}` : `new-focaccia-${imageKey}`}
                  onImageOptimized={handleImageOptimized}
                  options={{
                    maxWidth: 1200,
                    maxHeight: 800,
                    quality: 0.85,
                    format: 'jpeg',
                    maxSizeKB: 400
                  }}
                  initialImageUrl={focacciaEdit?.imageUrl}
                />
                {optimizationStats && (
                  <div className={optimizationStats.compressionRatio > 0 ? "adminFormNotice success" : "adminFormNotice info"}>
                    {optimizationStats.compressionRatio > 0
                      ? `Imagen optimizada: ${optimizationStats.compressionRatio}% de reducción`
                      : 'Imagen procesada: ya tenía tamaño óptimo'
                    }
                    <br />
                    <small>
                      {(optimizationStats.originalSize / 1024).toFixed(1)}KB a {(optimizationStats.optimizedSize / 1024).toFixed(1)}KB
                    </small>
                    <button
                      type="button"
                      onClick={handleClearImage}
                      className="clearImageButton"
                      aria-label='Limpiar imagen seleccionada'
                    >
                      <FaTrashAlt />
                      Limpiar
                    </button>
                  </div>
                )}
                {focacciaEdit?.imageUrl && !optimizedImageFile && (
                  <div className="adminFormNotice info">Usando imagen actual</div>
                )}
                </div>
              </div>
            </section>

            <section className='adminFormSection'>
              <div className='adminFormSectionHeader'>
                <span>3</span>
                <div>
                  <h3>Estado y etiquetas</h3>
                  <p>Controlá cómo aparece en el catálogo público.</p>
                </div>
              </div>

              <div className='checkboxRow'>
                <div className='formGroup'>
                  <label className='toggleCard' htmlFor="isVeggie">
                    <Field type="checkbox" id="isVeggie" name="isVeggie" />
                    <span className='toggleIcon'><FaLeaf /></span>
                    <span>
                      <strong>Veggie</strong>
                      <small>Aparece con etiqueta verde.</small>
                    </span>
                  </label>
                  <ErrorMessage name="isVeggie" component="div" className="error" />
                </div>
                <div className='formGroup'>
                  <label className='toggleCard' htmlFor="featured">
                    <Field type="checkbox" id="featured" name="featured" />
                    <span className='toggleIcon'><FaStar /></span>
                    <span>
                      <strong>Destacada</strong>
                      <small>Resalta dentro del menú.</small>
                    </span>
                  </label>
                <ErrorMessage name="featured" component="div" className="error" />
                </div>
                <div className='formGroup'>
                  <label className='toggleCard' htmlFor="isAvailable">
                    <Field type="checkbox" id="isAvailable" name="isAvailable" />
                    <span className='toggleIcon'><FaCheckCircle /></span>
                    <span>
                      <strong>Disponible</strong>
                      <small>Visible para pedidos.</small>
                    </span>
                  </label>
                  <ErrorMessage name="isAvailable" component="div" className="error" />
                </div>
              </div>
            </section>

            <div className='submitButtonContainer'>
              <button type="submit" className='submitButton' disabled={isSubmitting || isUploadingImage}>
                <FaSave />
                {isUploadingImage ? 'Subiendo imagen...' : focacciaEdit ? (isSubmitting ? 'Actualizando...' : 'Actualizar Focaccia') : (isSubmitting ? 'Creando...' : 'Crear Focaccia')}
              </button>
              <button type='button' className='cancelButton' onClick={() => {
                onClose();
                setOptimizedImageFile(null);
                setOptimizationStats(null);
                setImageKey(prev => prev + 1); // Forzar re-render del componente imagen
              }}>
                <FaTimes />
                Cancelar
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
