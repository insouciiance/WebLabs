using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HotChocolate.Types;

namespace ToDoWebApi.GraphQL.Users
{
    public class LogoutUserPayloadType : ObjectType<LogoutUserPayload>
    {
        protected override void Configure(IObjectTypeDescriptor<LogoutUserPayload> descriptor)
        {
            descriptor.Description("Represents the user logout result.");
        }
    }
}
