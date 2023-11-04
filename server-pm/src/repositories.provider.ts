import { Provider } from "@nestjs/common";
import { Connection } from "typeorm";

import { UserRepository } from "./repository/user.repository";
import { StaffRepository } from "./repository/staff.repository";
import { DistrictsRepository } from "./repository/districts.repository";
import { ProvincesRepository } from "./repository/provinces.repository";
import { WardsRepository } from "./repository/wards.repository";

const repositories = [
    UserRepository,
    StaffRepository,
    ProvincesRepository,
    DistrictsRepository,
    WardsRepository
];

const RepositoriesProvider: Provider[] = [];

for (const repository of repositories) {
    RepositoriesProvider.push({
      provide: repository,
      useFactory: (connection: Connection) => connection.getCustomRepository(repository),
      inject: ["MYSQL_CONNECTION"]
    });
  }
  
  export { RepositoriesProvider, repositories };