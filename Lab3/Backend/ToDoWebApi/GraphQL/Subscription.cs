using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HotChocolate;
using HotChocolate.Types;
using ToDoWebApi.GraphQL.Users;

namespace ToDoWebApi.GraphQL
{
    public class Subscription
    {
        [Subscribe]
        [Topic]
        public LoginUserPayload OnUserLogin([EventMessage] LoginUserPayload payload)
        {
            return payload;
        }
    }
}
