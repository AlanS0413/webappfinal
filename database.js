require('dotenv').config()
const Database = require('dbcmps369')
const bcrypt = require('bcryptjs');

class ContactDB{
    constructor(){
        this.db = new Database();
    }

    async initialize() {
        await this.db.connect()

        await this.db.schema('Contact', [
            {name: 'id', type: 'INTEGER'},
            {name: 'prefix', type: 'TEXT'},
            {name: 'firstname', type: 'TEXT'},
            {name: 'lastname', type: 'TEXT'},
            {name: 'phonenumber', type: 'TEXT'},
            {name: 'email', type: 'TEXT'},
            {name: 'street', type: 'TEXT'},
            {name: 'city', type: 'TEXT'},
            {name: 'state', type: 'TEXT'},
            {name: 'zip', type: 'TEXT'},
            {name: 'country', type: 'TEXT'},
            {name: 'contactByEmail', type: 'BOOLEAN'},
            {name: 'contactByPhone', type: 'BOOLEAN'},
            {name: 'contactByMail', type: 'BOOLEAN'},
            {name: 'lat', type: 'REAL'},
            {name: 'lng', type: 'REAL'}
        ], 'id');

        await this.db.schema('Users', [
            {name: 'id', type: 'INTEGER'},
            {name: 'first', type: 'TEXT'},
            {name: 'last', type: 'TEXT'},
            {name: 'username', type: 'TEXT'},
            {name: 'password', type: 'TEXT'},
        ], 'id');


        const user = await this.db.read('Users', [{ column: 'username', value: 'cmps369' }]);
        if (user.length === 0) {
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash('rcnj', salt);
            await this.db.create('Users',[{column: 'first', value: 'admin'}, {column: 'last', value: 'admin'}, {column:'username', value: 'cmps369'}, {column: 'password', value: hash}]);
            console.log('User created with username cmps369 and password rcnj')
        }

    }

    async createUser(first, last, username, password) {
        const id = await this.db.create('Users', [
            { column: 'first', value: first },
            { column: 'last', value: last },
            { column: 'username', value: username },
            { column: 'password', value: password },
        ])
        return id;
    }



    async createContact(prefix, firstname, lastname, email, phonenumber, street, city, state, zip, country, contact_by_phone, contact_by_email, contact_by_mail, lat, lng) {
        const id = await this.db.create('Contact', [
            {column: 'prefix', value: prefix},
            { column: 'firstname', value: firstname },
            { column: 'lastname', value: lastname },
            { column: 'email', value: email },
            { column: 'phonenumber', value: phonenumber },
            { column: 'street', value: street},
            { column: 'city', value: city},
            { column: 'state', value: state},
            { column: 'zip', value: zip},
            { column: 'country', value: country},
            { column: 'contactByEmail', value: contact_by_email },
            { column: 'contactByPhone', value: contact_by_phone },
            { column: 'contactByMail', value: contact_by_mail },
            { column: 'lat', value: lat},
            { column: 'lng', value: lng}
        ])
        return id;
    }

    async findContactById(id) {
        const contact = await this.db.read('Contact', [{column: 'id', value: id }] );
        if (contact.length > 0) return contact[0];
        else {
            return undefined;
        }
    }

    async findUserByUserName(username) {
        const us = await this.db.read('Users', [{ column: 'username', value: username }]);
        if (us.length > 0) return us[0];
        else {
            return undefined;
        }
    }

    async findrcnjUser(user_Id){
        const defaltUser = await this.db.read('Users', [{ column: 'username', value: 'cmps369' }, { column: 'password', value: 'rcnj' }], {column: 'id', value: user_Id});
        if(defaltUser.lenght > [])
            creatercnj = await this.db.createUser('admin', 'admin', 'cmps369', 'rcnj');
            else
                return undefined;
    }

    async findAllContacts() {
        const contacts = await this.db.read('Contact', []);
        return contacts;
    }

    async findContactByName(firstname) {
        const cname = await this.db.read('Contact', [{ column: 'firstname', value: firstname }]);
        return cname;
    }

    async updateContactData(prefix, firstname, lastname, email, phonenumber, street, city, state, zip, country, contact_by_phone, contact_by_email, contact_by_mail, id, lat, lng) {
        await this.db.update('Contact',[
            {column: 'prefix', value: prefix},
            { column: 'firstname', value: firstname },
            { column: 'lastname', value: lastname },
            { column: 'email', value: email },
            { column: 'phonenumber', value: phonenumber },
            { column: 'street', value: street},
            { column: 'city', value: city},
            { column: 'state', value: state},
            { column: 'zip', value: zip},
            { column: 'country', value: country},
            { column: 'contactByEmail', value: contact_by_email },
            { column: 'contactByPhone', value: contact_by_phone },
            { column: 'contactByMail', value: contact_by_mail },
            { column: 'lat', value: lat},
            { column: 'lng', value: lng}
        ], [{ column: 'id', value: id }])
    }

    async findAddresses(street, city, state, zip, country){
        const newaddys = await this.db.read('Contact',
        [{ column: 'street', value: street},
        { column: 'city', value: city},
        { column: 'state', value: state},
        { column: 'zip', value: zip},
        { column: 'country', value: country}]);
        return newaddys;
    }

    async updateCoords(lat, lng){
        await this.db.update('Contact', [
            { column: 'lat', value: lat},
            { column: 'lng', value: lng}
        ], [{ column: 'id', value: id }])
    }

    async findContactCoords(id, firstname,  lat, lng){
        const frontadd = await this.db.read('Contact',
        [{ column: 'id', value: id }],
        [{ column: 'firstname', value: firstname }],
        [{ column: 'lat', value: lat}],
        [{ column: 'lng', value: lng}])
        return frontadd;
    }

    async deleteContact(id) {
        await this.db.delete('Contact', [{ column: 'id', value: id }]);
      }
}

module.exports = ContactDB;