import Customer from "../../customer/entity/customer";
import CustomerAddressChangedEvent from "../../customer/event/customer-address-changed.event";
import CustomerCreatedEvent from "../../customer/event/customer-created.event";
import SendConsoleLog1WhenUserIsCreatedHandler from "../../customer/event/handler/send-console-log-1-when-customer-is-created";
import SendConsoleLog2WhenUserIsCreatedHandler from "../../customer/event/handler/send-console-log-2-when-customer-is-created";
import SendConsoleLogWhenUserChangeAddressHandler from "../../customer/event/handler/send-console-log-when-customer-change-address";
import Address from "../../customer/value-object/address";
import EventDispatcher from "./event-dispatcher";

describe("Customer event tests", () => {
  it("should send console events when create an user", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler1 = new SendConsoleLog1WhenUserIsCreatedHandler();
    const eventHandler2 = new SendConsoleLog2WhenUserIsCreatedHandler();
    const spyEventHandler1 = jest.spyOn(eventHandler1, "handle");
    const spyEventHandler2 = jest.spyOn(eventHandler2, "handle");

    eventDispatcher.register("CustomerCreatedEvent", eventHandler1);
    eventDispatcher.register("CustomerCreatedEvent", eventHandler2);

    expect(
      eventDispatcher.getEventHandlers["CustomerCreatedEvent"]
    ).toBeDefined();
    expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"].length).toBe(
      2
    );

    const customerCreatedEvent = new CustomerCreatedEvent({
        name: "Customer 1"
      });
  
    eventDispatcher.notify(customerCreatedEvent);
  
    expect(spyEventHandler1).toHaveBeenCalled();
    expect(spyEventHandler2).toHaveBeenCalled();

  });

  it("Should send console event when user updates its address", ()=>{

    const eventHandler = new SendConsoleLogWhenUserChangeAddressHandler();
    const spyEventHandler = jest.spyOn(eventHandler, "handle");
    

    const customer = new Customer("1", "Customer 1");
    customer.eventDispatcher.register("CustomerAddressChangedEvent", eventHandler);
    const address = new Address("Street 1", 123, "13330-250", "São Paulo");
    customer.Address = address;

    customer.activate();
    const address2 = new Address("Street New", 456, "11111-250", "São Paulo");
    customer.changeAddress(address2);

    expect(spyEventHandler).toHaveBeenCalled();
  });
});
