import { FaEdit, FaTrash } from 'react-icons/fa';
import type { FocacciaItem } from '../../../types';
import { ItemCategory } from '../../ItemCategory/ItemCategory';
import { ImageService } from '../../../services/ImageService';
import { toast } from 'react-toastify';
import Image from 'next/image';
import { useDeleteFocaccia } from '@/hooks/focaccia/useDeleteFocaccia ';
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
        await ImageService.deleteImage(item.imagePublicId)
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
      <div className='adminItemCardContent'>
        <div className='adminItemCardHeader'>
          <h2 className='adminItemName'>{item.name}</h2>
          {item.isVeggie && <ItemCategory focaccia={item} />}
          {item.featured && <span className='featuredBadge'>Destacada</span>}
        </div>
        <p className='adminItemDescription'>{item.description}</p>
        <span className='adminItemPrice'>$ {item.price}</span>
        <Image src={item.imageUrl} alt={item.name} width={300} height={200} className='adminItemImage' />
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
