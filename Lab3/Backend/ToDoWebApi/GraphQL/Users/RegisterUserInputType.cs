using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HotChocolate.Types;

namespace ToDoWebApi.GraphQL.Users
{
    public class RegisterUserInputType : InputObjectType<RegisterUserInput>
    {
        protected override void Configure(IInputObjectTypeDescriptor<RegisterUserInput> descriptor)
        {
            descriptor.Description("Represents the input to register a new user.");
        }
    }
}
