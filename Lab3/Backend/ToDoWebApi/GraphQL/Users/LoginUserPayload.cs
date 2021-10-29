using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ToDoWebApi.Models;

namespace ToDoWebApi.GraphQL.Users
{
    public record LoginUserPayload(ApplicationUser user, string JwtToken);
}
