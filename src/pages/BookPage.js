import React, {useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getBooks } from "../features/book/bookSlice";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Container } from "@mui/material";
import BookItem from "../features/book/bookItem";

function BookPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const { books, totalPages, currentPage } = useSelector((state) => state.book);

  const category = searchParams.get("category") || "";
  const search = searchParams.get("search") || "";
  const page = parseInt(searchParams.get("page")) || 1;

  const [categoryName, setCategoryName] = useState("");


  useEffect(() => {
    if (category) {
      dispatch(getBooks(page, search, "", "", category));

      const categoryMap = {
        "66ee3a6f1191f821c77c5704": "Medical",  
        "66ee3a6f1191f821c77c5705": "Art-Photography",
        "66ee3a6f1191f821c77c5706": "Biography",
        "66ee3a6f1191f821c77c5707": "Business-Finance-Law",
        "66ee3a6f1191f821c77c5708": "Childrens-Books",
        "66ee3a6f1191f821c77c5709": "Computing",
        "66ee3a6f1191f821c77c570a": "Crafts-Hobbies",
        "66ee3a6f1191f821c77c570b": "Crime-Thriller",
        "66ee3a6f1191f821c77c570c": "Dictionaries-Languages", 
        "66ee3a6f1191f821c77c570d": "Entertainment",
        "66ee3a6f1191f821c77c570e": "Food Drink",
        "66ee3a6f1191f821c77c570f": "Graphic-Novels-Anime-Manga",
        "66ee3a6f1191f821c77c5710": "Health",
        "66ee3a6f1191f821c77c5711": "Personal-Development",
        "66ee3a6f1191f821c77c5712": "Poetry-Drama",         
      };
      setCategoryName(categoryMap[category] || "Unknown Category");
    }
  }, [dispatch, page, search, category]);

  return (
    <Container>
      <BookItem
        title={`Books in ${categoryName}`} 
        books={books}
        currentPage={currentPage}
        totalPages={totalPages}
        handleNextPage={() => navigate(`?page=${page + 1}&category=${category}&search=${search}`)}
        handlePrevPage={() => navigate(`?page=${page - 1}&category=${category}&search=${search}`)}
      />
    </Container>
  );
}

export default BookPage;
