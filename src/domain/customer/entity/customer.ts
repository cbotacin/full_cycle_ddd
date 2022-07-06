import EventDispatcher from "../../@shared/event/event-dispatcher";
import CustomerAddressChangedEvent from "../event/customer-address-changed.event";
import SendConsoleLog1WhenUserIsCreatedHandler from "../event/handler/send-console-log-1-when-customer-is-created";
import SendConsoleLogWhenUserChangeAddressHandler from "../event/handler/send-console-log-when-customer-change-address";
import Address from "../value-object/address";

export default class Customer {
  private _id: string;
  private _name: string = "";
  private _address!: Address;
  private _active: boolean = false;
  private _rewardPoints: number = 0;
  private _eventDispatcher = new EventDispatcher();

  constructor(id: string, name: string) {
    this._id = id;
    this._name = name;
    this.validate();
  }

  get eventDispatcher(): EventDispatcher {
    return this._eventDispatcher;
  }

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get rewardPoints(): number {
    return this._rewardPoints;
  }

  validate() {
    if (this._id.length === 0) {
      throw new Error("Id is required");
    }
    if (this._name.length === 0) {
      throw new Error("Name is required");
    }
  }

  changeName(name: string) {
    this._name = name;
    this.validate();
  }

  get Address(): Address {
    return this._address;
  }
  
  changeAddress(address: Address) {
    this._address = address;
    const customerAddressChange = new CustomerAddressChangedEvent({
      id: this.id,
      name: this.name,
      address: address
    });
    this.eventDispatcher.notify(customerAddressChange)
  }

  isActive(): boolean {
    return this._active;
  }

  activate() {
    if (this._address === undefined) {
      throw new Error("Address is mandatory to activate a customer");
    }
    this._active = true;
  }

  deactivate() {
    this._active = false;
  }

  addRewardPoints(points: number) {
    this._rewardPoints += points;
  }

  set Address(address: Address) {
    this._address = address;
  }
}
