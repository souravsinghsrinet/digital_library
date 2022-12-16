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

    const addBook = (book) => {
        const body = JSON.stringify({
            volume_id: book.id,
            title: book.volumeInfo.title,
            authors: book.volumeInfo.authors?.join(", "),
            thumbnail: book.volumeInfo.imageLinks?.thumbnail,
            state: 2,
        })

        fetch("http://127.0.0.1:8000/books", {
            method: "POST", 
            headers: {
                Accept: "application/json", 
                "Content-Type": "application/json",
            },
            body: body
        }).then(response => response.json()).then(data => {
            refreshData();
            bookAddedToast({
                title: "Added",
                description: "Book added to wishlish",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
        });
    }

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
                                <VStack>
                                    <Badge colorScheme="red">
                                        Google Rating:{" "}
                                        {
                                            book.volumeInfo.averageRating? book.volumeInfo.averageRating:"N/A"
                                        }
                                    </Badge>
                                    <Text align="center">
                                        Author: {book.volumeInfo.authors?.join(", ")}
                                    </Text>
                                </VStack>
                                <VStack>
                                    <Heading size="md">{book.volumeInfo.title}</Heading>
                                    <Text padding={3} color="grey">
                                        {
                                            book.searchInfo?.textSnippet? book.searchInfo?.textSnippet:book.volumeInfo.subtitle
                                        }
                                    </Text>
                                    <Center paddingBottom={2}>
                                        <Button variant="outline" onClick={() => addBook(book)}>
                                            <HStack>
                                                <AddIcon w={4} h={4} color="red.500" />
                                                <Text>Add Book</Text>
                                            </HStack>
                                        </Button>
                                    </Center>
                                </VStack>
                            </VStack>
                        )
                    })
                }
            </SimpleGrid>
        </VStack>
    )
}