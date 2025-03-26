'use client'
import * as React from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import { ReactNode, useEffect, useState } from "react";
import { Image } from '~/components/image';

interface Image {
    altText: string;
    src: string;
}

type Price =
    | string
    | {
        type: 'sale';
        currentValue: string;
        previousValue: string;
    }
    | {
        type: 'range';
        minValue: string;
        maxValue: string;
    };

interface QuickViewProps {
    id: string;
    name: string;
    image?: Image;
    price?: Price;
    addToCart?: ReactNode;
}


const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

export default function CustomizedDialogs({ id, name, image, price, addToCart }: QuickViewProps) {
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    return (
        <React.Fragment>
            <Button variant="outlined" onClick={handleClickOpen}>
                Quick-view-Mui
            </Button>
            <BootstrapDialog
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={open}
            >
                <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
                    {name}
                </DialogTitle>
                <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    sx={(theme) => ({
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: theme.palette.grey[500],
                    })}
                >
                    <CloseIcon />
                </IconButton>
                <DialogContent dividers>
                    <Typography gutterBottom>
                        Product ID: {id}
                    </Typography>
                    <Typography gutterBottom>
                        {image && (
                            <div style={{ position: "relative", width: "100%", height: "200px" }}>
                                <Image
                                    alt={image.altText}
                                    src={image.src}
                                    fill
                                    className="object-contain"
                                    sizes="(max-width: 768px) 50vw, (max-width: 1536px) 25vw, 500px"
                                />
                            </div>
                        )}
                    </Typography>
                    <Typography gutterBottom>
                        {Boolean(price) &&
                            (typeof price === 'object' ? (
                                <p className="flex flex-col gap-1">
                                    {price.type === 'range' && (
                                        <span>
                                            {price.minValue} - {price.maxValue}
                                        </span>
                                    )}

                                    {price.type === 'sale' && (
                                        <>
                                            <span>
                                                Was: <span className="line-through">{price.previousValue}</span>
                                            </span>
                                            <span>Now: {price.currentValue}</span>
                                        </>
                                    )}
                                </p>
                            ) : (
                                <span>{price}</span>
                            ))}
                    </Typography>
                    <Typography gutterBottom>
                        {addToCart}
                    </Typography>
                </DialogContent>
            </BootstrapDialog>
        </React.Fragment>
    );
}