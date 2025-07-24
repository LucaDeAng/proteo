"use client"
import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from "@/lib/utils"

interface TextItem {
    text: string;
    image: string;
}

interface CircularRevealHeadingProps {
    items: TextItem[];
    centerText: React.ReactNode;
    className?: string;
    size?: 'sm' | 'md' | 'lg';
}

const sizeConfig = {
    sm: {
        container: 'h-[300px] w-[300px]',
        fontSize: 'text-xs',
        tracking: 'tracking-[0.25em]',
        radius: 160,
        gap: 40,
        imageSize: 'w-[75%] h-[75%]',
        textStyle: 'font-medium'
    },
    md: {
        container: 'h-[400px] w-[400px]',
        fontSize: 'text-sm',
        tracking: 'tracking-[0.2em]',
        radius: 200,
        gap: 50,
        imageSize: 'w-[80%] h-[80%]',
        textStyle: 'font-semibold'
    },
    lg: {
        container: 'h-[500px] w-[500px]',
        fontSize: 'text-base',
        tracking: 'tracking-[0.15em]',
        radius: 250,
        gap: 60,
        imageSize: 'w-[85%] h-[85%]',
        textStyle: 'font-bold'
    }
};

export function CircularRevealHeading({ 
    items, 
    centerText, 
    className, 
    size = 'md' 
}: CircularRevealHeadingProps) {
    const [activeImage, setActiveImage] = useState<string | null>(null);
    const [imagesLoaded, setImagesLoaded] = useState(false);
    const config = sizeConfig[size];

    useEffect(() => {
        const preloadImages = async () => {
            const imagePromises = items.map((item) => {
                return new Promise((resolve, reject) => {
                    const img = new Image();
                    img.onload = resolve;
                    img.onerror = reject;
                    img.src = item.image;
                });
            });

            try {
                await Promise.all(imagePromises);
                setImagesLoaded(true);
            } catch (error) {
                console.error('Failed to preload images:', error);
            }
        };

        preloadImages();
    }, [items]);

    const createCircularText = () => {
        const totalItems = items.length;
        const availableDegrees = 360 - (config.gap * totalItems);
        const segmentDegrees = availableDegrees / totalItems;

        return items.map((item, index) => {
            const startPosition = index * (segmentDegrees + config.gap);
            const centerAngle = startPosition + segmentDegrees / 2;
            const textRadius = config.radius / 2;
            
            const x = Math.cos((centerAngle - 90) * Math.PI / 180) * textRadius;
            const y = Math.sin((centerAngle - 90) * Math.PI / 180) * textRadius;

            return (
                <g key={index}>
                    <text
                        className={cn(
                            config.fontSize,
                            config.tracking,
                            config.textStyle,
                            "uppercase cursor-pointer transition-all duration-300 fill-current"
                        )}
                        x={x}
                        y={y}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        transform={`rotate(${centerAngle}, ${x}, ${y})`}
                        onMouseEnter={() => imagesLoaded && setActiveImage(item.image)}
                        onMouseLeave={() => setActiveImage(null)}
                        style={{
                            filter: 'url(#textShadow)',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        {item.text}
                    </text>
                </g>
            );
        });
    };

    return (
        <div className={cn("relative flex items-center justify-center", config.container, className)}>
            {/* Background image with reveal effect */}
            <div className="absolute inset-0 overflow-hidden rounded-full">
                <AnimatePresence mode="wait">
                    {activeImage && (
                        <motion.div
                            key={activeImage}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                            className="absolute inset-0 rounded-full"
                        >
                            <img
                                src={activeImage}
                                alt="Background"
                                className={cn("object-cover rounded-full", config.imageSize)}
                                style={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)'
                                }}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Circular text */}
            <svg
                className="absolute inset-0 w-full h-full"
                viewBox={`-${config.radius/2} -${config.radius/2} ${config.radius} ${config.radius}`}
            >
                <defs>
                    <filter id="textShadow" x="-50%" y="-50%" width="200%" height="200%">
                        <feDropShadow dx="2" dy="2" stdDeviation="3" floodOpacity="0.3"/>
                    </filter>
                </defs>
                {createCircularText()}
            </svg>

            {/* Center content */}
            <div className="relative z-10 text-center">
                <motion.div
                    animate={{ scale: activeImage ? 0.9 : 1 }}
                    transition={{ duration: 0.3 }}
                >
                    {centerText}
                </motion.div>
            </div>
        </div>
    );
}