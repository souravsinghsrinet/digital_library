import {
    Center,
    Text,
    Heading,
    VStack,
    Button,
    Input,
    HStack,
    SimpleGrid,
    Image,
    Badge,
    useToast,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { useState, useEffect } from "react";
import React from 'react';

const API_KEY = "AIzaSyC7ki9C5iMIud28T0yCBiqz8YKxFi0FJNY";

export default function Discover({ refreshData }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState("");

    const bookAddedToast = useToast();

    const onSearchClick = () => {
        fetch(
            `https://www.googleapis.com/books/v1/volumes?q=${searchQuery}&key=${API_KEY}&maxResults=40`
        )
        .then((response) => response.json())
        .then((data) => setSearchResults(data["items"]));
    };

    return (
        <VStack spacing={7} paddingTop={5}>
            <Heading size="lg"> Search Books</Heading>
            <Text>Find new books to add to your library</Text>
            <HStack spacing={12}>
                <Input width="600px" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                <Button colorScheme="red" size="lg" onClick={onSearchClick}>
                    Search Book
                </Button>
            </HStack>
            {
                searchResults.length === 0 && (
                    <Center>
                        <Heading>You gotta search to see results!!!!</Heading>
                    </Center>
                )
            }
            <SimpleGrid columns={4} spacing={8}>
                {
                    searchResults.length !== 0 && searchResults.map((book) => {
                        return (
                            <VStack maxW="sm" borderWidth="1px" borderRadius="lg" overflow="hidden" spacing={8} key={book.id}>
                                <Image src={book.volumeInfo.imageLinks?.thumbnail} width={40} height={60} paddingTop={2} />
                                <Badge borderRadius="full" px="2" colorScheme="teal">
                                    {book.volumeInfo.categories?.join(", ")}
                                </Badge>
                            </VStack>
                        )
                    })
                }
            </SimpleGrid>
        </VStack>
    )
}