using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ToDoWebApi.GraphQL.Users
{
    public record RegisterUserInput(string UserName, string Email, string Password, string PasswordConfirm);
}
