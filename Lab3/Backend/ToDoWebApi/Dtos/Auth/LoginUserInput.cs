using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ToDoWebApi.Dtos.Auth
{
    public class LoginUserInput
    {
        public string UserName { get; set; }

        public string Password { get; set; }
    }
}
