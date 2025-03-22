const UserBooks = require("../Models/Books");

//POST
const AllBooks = async (req, res) => {
  try {
    const { title, author, image } = req.body;

    //create new book
    const newBook = new UserBooks({ title, author, image });
    await newBook.save();

    res.status(201).json({
      success: true,
      message: "Book created successfully",
      data: newBook,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

//GET
// const GetBooks = async (req, res) => {
//   try {
//     const books = await UserBooks.find(); // Fetch all books from the database
//     res.status(200).json({
//       success: true,
//       message: "Books retrieved successfully",
//       data: books,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Server error",
//       error: error.message,
//     });
//   }
// };

const GetBooks = async (req, res) => {
  try {
    // Fetch all books from the database
    const books = await UserBooks.find();

    // Get category from request body (assuming category is sent in the payload)
    const { category } = req.body;

    // Define book categories with keywords to match the titles
    const categories = {
      "Action/Adventure": [
        "The Alchemist- 25th Anniversary Edition",
        "Fight Club",
      ],
      "Autobiography/Memoir": [
        "A Long Walk To Freedom",
        "Murakami The Autobiography",
        "The Steve Jobs",
      ],
      "Art & Photography": ["The Picture Of Dorain Gray"],
      Biography: ["The Steve Jobs"],
      "Children's Fiction": [
        "The Chronicles of Narnia",
        "James and the Giant Peach",
        "The Giving Tree",
      ],
      "Classic Fiction": [
        "To Kill A Mockingbird",
        "Wuthering Heights",
        "Gone with the Wind",
      ],
      "Comedy Horror": ["The Fault In Our Stars"],
      "Contemporary Fiction": [],
      "Cozy Mystery": [],
      Crime: ["Catch-22: 50th Anniversary Edition"],
      "Dark Fantasy": [],
      "Disaster Thriller": [],
      "Erotic Romance": [],
      "Espionage Thriller": [],
      "Fairy Tales": [],
      Fantasy: ["Harry Potter and the Cursed Child", "The Lord of the Rings"],
      Folktales: [],
      "Food & Drink": [],
      "Gothic Horror": ["The Picture Of Dorain Gray"],
      "Graphic Novel": [],
      "Hard Sci-Fi": [],
      "Historical Fiction": ["The Odyssey", "Gone with the Wind"],
      "Historical Mystery": [],
      "Historical Thriller": [],
      Horror: [],
      Humor: ["Don't Make Me Think"],
      "LGBTQ+": [],
      "Legal Thriller": [],
      "Literary Fiction": [],
      "Magical Realism": [],
      "Military Sci-Fi": [],
      "Mind Upload Sci-Fi": [],
      Mystery: [],
      "Mythic Fantasy": ["The Epic of Gilgamesh", "Ovid And The Metamorphoses"],
      "New Adult": [],
      Noir: [],
      "Paranormal Romance": [],
      Philosophy: ["The Nicomachean Ethics Of Aristotle", "The Art Of War"],
      "Political Thriller": [],
      "Post-Apocalyptic": [],
      "Psychological Thriller": [],
      "Quiet Horror": [],
      Regency: [],
      Religious: ["Bhagavad Gita As It Is", "The Confessions of St.Augustine"],
      Romance: [],
      "Romantic Comedy": [],
      "Romantic Suspense": [],
      Satire: [],
      "Science & Technology": [],
      "Science Fiction": ["The Hunger Games"],
      "Self-Help": [
        "The Subtle Art of Not Giving a F*ck",
        "Think And Grow Rich",
      ],
      "Short Story": [],
      "Space Opera": [],
      "Space Western": [],
      Steampunk: [],
      "Supernatural Mystery": [],
      Thriller: [],
      Travel: [],
      "True Crime": [],
      "Urban Fantasy": [],
      Western: [],
      "Women's Fiction": [],
      "Young Adult": ["The Book Thief", "The Fault In Our Stars"],
      "Non-Fiction": [
        "Drive-The Truth About What Motivates Us",
        "Shoe Dog-A Memoir by the Creator of Nike",
      ],
      Mythology: [
        "Gilgamesh the King",
        "The Epic of Gilgamesh",
        "Ovid And The Metamorphoses",
      ],
    };

    // Ensure that the category exists in the defined categories
    if (!categories[category] || categories[category].length === 0) {
      const shuffledBooks = books.sort(() => Math.random() - 0.5);
      return res.status(200).json({
        success: true,
        message: "All books retrieved as the selected category is empty",
        data: shuffledBooks.slice(0, 30),
      });
    }

    // Filter books based on the selected category
    const filteredBooks = books.filter((book) => {
      // Iterate over categories and match keywords with book titles
      return categories[category].some((keyword) =>
        book.title.includes(keyword)
      );
    });

    res.status(200).json({
      success: true,
      message: `${category} books retrieved successfully`,
      data: filteredBooks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = { GetBooks };

// // const GetBooks = async (req, res) => {
// //   try {
// //     const { email } = req.query;

// //     if (!email) {
// //       return res
// //         .status(400)
// //         .json({ success: false, message: "Email is required" });
// //     }

// //     // Find user by email
// //     const user = await UserModel.findOne({ email });
// //     if (!user) {
// //       return res
// //         .status(404)
// //         .json({ success: false, message: "User not found" });
// //     }

// //     // Get user goals and genres
// //     const userGoalsDetails = await UserGoals.findOne({ userId: user._id });
// //     if (!userGoalsDetails) {
// //       return res
// //         .status(404)
// //         .json({ success: false, message: "User goals not found" });
// //     }

// //     const { readinggoals, favgenres } = userGoalsDetails;

// //     // Fetch books from the database
// //     let books = await UserBooks.find();

// //     // **Filter books based on favorite genres (case-insensitive matching)**
// //     books = books.filter((book) =>
// //       favgenres.some((genre) =>
// //         book.genre.toLowerCase().includes(genre.toLowerCase())
// //       )
// //     );

// //     // **Apply goal-based filtering**
// //     books = filterBooksByGoal(books, readinggoals);

// //     res.status(200).json({
// //       success: true,
// //       message: "Books retrieved successfully",
// //       data: books,
// //     });
// //   } catch (error) {
// //     res.status(500).json({
// //       success: false,
// //       message: "Server error",
// //       error: error.message,
// //     });
// //   }
// // };

// // **Filter books based on user reading goals**
// const filterBooksByGoal = (books, goal) => {
//   switch (goal) {
//     case "To discover new books":
//       return books.sort(() => Math.random() - 0.5).slice(0, 10);

//     case "Follow friends & family reads":
//       return books.filter((book) => book.popularAmongFriends); // Ensure this field exists in DB

//     case "Books for study purposes":
//       return books.filter(
//         (book) =>
//           book.genre.toLowerCase().includes("self-help") ||
//           book.genre.toLowerCase().includes("philosophy") ||
//           book.genre.toLowerCase().includes("education")
//       );

//     case "No goals, just experimenting":
//       return books.sort(() => Math.random() - 0.5).slice(0, 15);

//     default:
//       return books;
//   }
// };

module.exports = {
  AllBooks,
  GetBooks,
};
