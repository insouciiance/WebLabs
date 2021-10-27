using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HotChocolate.Types;

namespace ToDoWebApi.GraphQL.Users
{
    public class LoginUserInputType : InputObjectType<LoginUserInput>
    {
        protected override void Configure(IInputObjectTypeDescriptor<LoginUserInput> descriptor)
        {
            descriptor.Description("Represents the input to login an existing user.");
        }
    }
}
