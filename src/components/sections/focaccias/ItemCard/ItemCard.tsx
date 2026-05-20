'use client';

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { Modal } from '@/components/shared/Modal/Modal'
import type { FocacciaItem, FocacciaSize } from '@/types'
import { ItemCategory } from '../ItemCategory/ItemCategory'
import { animateItemCard } from '@/animations'
import { useCartStore } from '@/store/cart.store'
import { CustomButton } from '@/components/shared/CustomButton/CustomButton';
import './_itemCard.scss'

type ItemCardProps = {
  focaccia: FocacciaItem
}

export const ItemCard = ({ focaccia }: ItemCardProps) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState<FocacciaSize>('MEDIANA');
  const [imageError, setImageError] = useState(false);
  const [showSkeleton, setShowSkeleton] = useState(true);

  const addFocaccia = useCartStore(state => state.addFocaccia);
  const cardRef = useRef<HTMLDivElement>(null);

  const selectedPrice = selectedSize === 'GRANDE' ? focaccia.largePrice : focaccia.mediumPrice;

  useEffect(() => {
    if (cardRef.current) {
      const ctx = animateItemCard(cardRef.current);

      return () => {
        ctx.revert();
      };
    }
  }, []);

  const handleAddToCart = () => {
    const unitPrice = selectedSize === 'GRANDE' ? focaccia.largePrice : focaccia.mediumPrice;

    addFocaccia({
      focaccia,
      size: selectedSize,
      cantidad: 1,
      unitPrice,
      subtotal: unitPrice,
    });
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
              sizes="(max-width: 768px) 100vw, 300px"
              className='itemImage'
              onLoad={() => setShowSkeleton(false)}
            />
          ) : (
            <div className='imageError'>
              <span>⚠️ Error al cargar imagen</span>
            </div>
          )}
        </picture>

        <h3 className='itemName'>{focaccia.name}</h3>
        <p className='itemDescription'>{focaccia.description}</p>

        <div className='itemSizeSelector'>
          <button
            type='button'
            className={`sizeButton ${selectedSize === 'MEDIANA' ? 'active' : ''}`}
            onClick={() => setSelectedSize('MEDIANA')}
          >
            <span className='sizeTitle'>Mediana</span>
            <span className='sizeHint'>2/3 pers</span>
          </button>
          <button
            type='button'
            className={`sizeButton ${selectedSize === 'GRANDE' ? 'active' : ''}`}
            onClick={() => setSelectedSize('GRANDE')}
          >
            <span className='sizeTitle'>Grande</span>
            <span className='sizeHint'>4/6 pers</span>
          </button>
        </div>
        <CustomButton selectedPrice={selectedPrice} onAddToCart={handleAddToCart} />

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
