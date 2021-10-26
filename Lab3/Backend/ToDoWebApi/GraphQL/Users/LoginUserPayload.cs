using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ToDoWebApi.GraphQL.Users
{
    public record LoginUserPayload(string UserName, string Email, string JwtToken);
}
