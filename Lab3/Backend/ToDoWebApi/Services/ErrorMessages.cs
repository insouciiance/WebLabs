using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ToDoWebApi.Services
{
    public static class ErrorMessages
    {
        public const string EmptyUsername = "Please enter your username.";

        public const string EmptyPassword = "Please enter your password.";

        public const string EmailNotValid = "Please provide a valid email address.";

        public const string PasswordUppercaseLetter = "Password should have at least one uppercase letter.";

        public const string PasswordLowercaseLetter = "Password should have at least one lowercase letter.";

        public const string PasswordDigit = "Password should have at least one digit.";

        public const string PasswordLength = "Password should be at least 6 characters long.";

        public const string PasswordsMatch = "Passwords do not match";

        public const string CheckboxIdEmpty = "The checkbox id can not be empty.";

        public const string NoteIdEmpty = "The note id can not be empty.";

        public const string CheckboxTextEmpty = "The checkbox text can not be empty.";

        public const string NoteNameEmpty = "The note text can not be empty.";

        public const string CantCreateUser = "There was a problem with creating the user.";

        public const string InvalidCredentials = "The user does not exist or the password is invalid.";

        public const string CantUpdateNote = "There was a problem with updating the note.";

        public const string CantDeleteNote = "There was a problem with deleting the note.";

        public const string CantAddCheckbox = "There was a problem with adding the checkbox.";

        public const string CantUpdateCheckbox = "There was a problem with updating the checkbox.";

        public const string CantDeleteCheckbox = "There was a problem with deleting the note.";

        public const string UserExists = "A user with this username or password already exists.";
    }
}
