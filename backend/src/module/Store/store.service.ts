import Store from "./store.model";
import bcrypt from "bcryptjs";
import { CreateStoreDTO } from "./dto/create-store.dto";
import { UpdateStoreDTO } from "./dto/update-store.dto";

export class StoreService {

    public async create(data: CreateStoreDTO) {
        const { password } = data;
        const passwordHash = await bcrypt.hash(password, 10);
        const store = await Store.create({ ...data, password: passwordHash });
        return store;
    }

    public async find() {
        const stores = await Store.find();
        return stores;
    }

    public async findById(storeId: string) {
        const store = await Store.findById(storeId);
        return store;
    }

    public async update(storeId: string, data: UpdateStoreDTO) {
        const { password } = data;

        if (!password) {
            const store = await Store.findByIdAndUpdate(storeId, data, { new: true });
            return store;
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const store = await Store.findByIdAndUpdate(
            storeId,
            { ...data, password: passwordHash },
            { new: true }
        );

        return store;
    }

    public async delete(storeId: string) {
        const store = await Store.findByIdAndDelete(storeId);
        return store;
    }
}
