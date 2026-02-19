'use client';

import { useState, useEffect, useRef } from 'react'
import { BiCart } from 'react-icons/bi'
import Image from 'next/image'
import { Modal } from '../Modal/Modal'
import type { FocacciaItem } from '../../types'
import { ItemCategory } from '../ItemCategory/ItemCategory'
import { animateItemCard } from '../../animations'
import { useCartStore } from '@/store/cart.store'
import './_itemCard.scss'

type ItemCardProps = {
  focaccia: FocacciaItem
}

export const ItemCard = ({ focaccia }: ItemCardProps) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [showSkeleton, setShowSkeleton] = useState(true);

  const addToCart = useCartStore(state => state.addToCart);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (cardRef.current) {
      animateItemCard(cardRef.current);
    }
  }, []);

  const handleAddToCart = () => {
    addToCart(focaccia);
  };

  return (
    <>
      <div className='itemCard' ref={cardRef}>
        <picture
          className='itemImageContainer'
          onClick={() => setModalOpen(true)}
        >
          {showSkeleton && (
            <div className='imageSkeleton'>
              <div className='skeletonShimmer'></div>
            </div>
          )}

          {!imageError && focaccia.imageUrl ? (
            <Image
              src={focaccia.imageUrl}
              alt={focaccia.name}
              width={300}
              height={300}
              className='itemImage'
              onLoad={() => setShowSkeleton(false)}
              onError={() => {
                setImageError(true);
                setShowSkeleton(false);
              }}
            />
          ) : (
            <div className='imageError'>
              <span>⚠️ Error al cargar imagen</span>
            </div>
          )}
        </picture>

        <h3 className='itemName'>{focaccia.name}</h3>
        <p className='itemDescription'>{focaccia.description}</p>

        <div className='itemCardFooter'>
          <p className='itemPrice'>${focaccia.price}</p>
          <button
            className='addToCartButton'
            onClick={handleAddToCart}
          >
            <BiCart /> Agregar
          </button>
        </div>

        {focaccia.featured && (
          <span className='itemFeature'>¡Destacado!</span>
        )}

        {focaccia.isVeggie && (
          <ItemCategory focaccia={focaccia} />
        )}
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        imageSrc={focaccia.imageUrl}
      />
    </>
  )
}
