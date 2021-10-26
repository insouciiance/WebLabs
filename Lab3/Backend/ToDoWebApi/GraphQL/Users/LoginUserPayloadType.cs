using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HotChocolate.Types;

namespace ToDoWebApi.GraphQL.Users
{
    public class LoginUserPayloadType : ObjectType<LoginUserPayload>
    {
        protected override void Configure(IObjectTypeDescriptor<LoginUserPayload> descriptor)
        {
            descriptor.Description("Represents the input to register a new user.");
        }
    }
}
