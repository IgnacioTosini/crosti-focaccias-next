import { FaEdit, FaImage, FaTrash } from 'react-icons/fa';
import type { FocacciaItem } from '@/types';
import { ItemCategory } from '@/components/sections/focaccias/ItemCategory/ItemCategory';
import { ImageService } from '@/services/ImageService';
import { toast } from 'react-toastify';
import Image from 'next/image';
import { useDeleteFocaccia } from '@/hooks/focaccia/useDeleteFocaccia';
import './_adminItemCard.scss'

type AdminItemCardProps = {
  item: FocacciaItem;
  onEdit: () => void;
}

export const AdminItemCard = ({ item, onEdit }: AdminItemCardProps) => {
  const deleteMutation = useDeleteFocaccia();

  const handleDelete = async () => {
    if (!window.confirm('¿Seguro que deseas eliminar esta focaccia?')) return
    try {
      if (item.imagePublicId) {
        const imageDeleteResult = await ImageService.deleteImage(item.imagePublicId)

        if (!imageDeleteResult?.success) {
          throw new Error(imageDeleteResult?.error ?? 'No se pudo eliminar la imagen en Cloudinary')
        }
      }

      await deleteMutation.mutateAsync(item.id)
      toast.success('Focaccia eliminada')
    } catch {
      toast.error('Error al eliminar')
    }
  }

  const handleEdit = () => {
    onEdit()
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }, 100)
  }

  return (
    <div className='adminItemCard'>
      <div className='adminItemMedia'>
        {item.imageUrl ? (
          <Image src={item.imageUrl} alt={item.name} width={160} height={120} className='adminItemImage' />
        ) : (
          <div className='adminItemImageFallback' aria-hidden='true'>
            <FaImage />
          </div>
        )}
      </div>

      <div className='adminItemCardContent'>
        <div className='adminItemCardHeader'>
          <h2 className='adminItemName'>{item.name}</h2>
          <div className='adminItemBadges'>
            {item.isVeggie && <ItemCategory focaccia={item} />}
            {item.featured && <span className='featuredBadge'>Destacada</span>}
            {!item.isAvailable && <span className='unavailableBadge'>No disponible</span>}
          </div>
        </div>
        <p className='adminItemDescription'>{item.description}</p>
      </div>

      <div className='adminItemPrices' aria-label='Precios'>
        <span>
          <small>Mediana</small>
          $ {item.mediumPrice}
        </span>
        <span>
          <small>Grande</small>
          $ {item.largePrice}
        </span>
      </div>

      <div className='adminItemCardActions'>
        <button
          className='adminItemCardEditButton'
          onClick={handleEdit}
          aria-label={`Editar ${item.name}`}
        >
          <FaEdit />
        </button>
        <button
          className='adminItemCardDeleteButton'
          onClick={handleDelete}
          aria-label={`Eliminar ${item.name}`}
        >
          <FaTrash />
        </button>
      </div>
    </div>
  )
}
