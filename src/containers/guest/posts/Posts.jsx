import { useEffect, useState } from 'react';

import { Container, Unstable_Grid2 as Grid } from '@mui/material';
import MainFeaturedPost from './MainFeaturedPost';
import FeaturedPost from './FeaturedPost';

const Posts = () => {
    const mainFeaturedPost = {
        title: 'Title of a longer featured blog post',
        description:
            "Multiple lines of text that form the lede, informing new readers quickly and efficiently about what's most interesting in this post's contents.",
        image: 'https://source.unsplash.com/random?wallpapers',
        imageText: 'main image description',
        linkText: 'Continue reading…',
    };

    const featuredPosts = [
        {
            title: 'Featured post',
            date: 'Nov 12',
            description: 'This is a wider card with supporting text below as a natural lead-in to additional content.',
            image: 'https://source.unsplash.com/random?wallpapers',
            imageLabel: 'Image Text',
        },
        {
            title: 'Post title',
            date: 'Nov 11',
            description: 'This is a wider card with supporting text below as a natural lead-in to additional content.',
            image: 'https://source.unsplash.com/random?wallpapers',
            imageLabel: 'Image Text',
        },
    ];
    return (
        <>
            <Container sx={{ padding: '50px 0' }}>
                <MainFeaturedPost post={mainFeaturedPost} />
                <Grid container spacing={4}>
                    {featuredPosts.map(post => (
                        <FeaturedPost key={post.title} post={post} />
                    ))}
                </Grid>
            </Container>
        </>
    );
};
export default Posts;
